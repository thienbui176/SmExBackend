import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import SettlementHistory, {
    SETTLEMENT_PAYMENT_STATUS,
    SettlementDetail,
} from '../Entity/SettlementHistory';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../Entity/Transaction';
import { Room } from '../../Room/Entity/Room';
import RoomService from '../../Room/RoomService';
import TransactionService from './TransactionService';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { checkElementInArrayObjectId } from 'src/Core/Utils/Helpers';
import UpdateStatusSettledOfUserRequest from '../Request/UpdateStatusSettledOfUserRequest';

export default class SettlementService extends AbstractCrudService<SettlementHistory> {
    constructor(
        @InjectModel(SettlementHistory.name)
        protected readonly repository: Model<SettlementHistory>,
        private readonly roomService: RoomService,
        private readonly transactionService: TransactionService,
    ) {
        super(repository);
    }

    public async createSettlementTransaction(requesterUserId: string, roomId: string) {
        try {
            const room = await this.roomService.findById(roomId);
            this.validateCreateSettlementTransaction(requesterUserId, room);
            const transactions = await this.transactionService.findAll({
                // Chỉ thực hiện tính cho những giao dịch chưa được tính.
                settlementId: { $eq: null },
                roomId: new Types.ObjectId(roomId),
            });

            if (!transactions.length)
                throw new NotFoundException(`Không có giao dịch nào cần quyết toán`);

            const detailsAfterCalculate = this.calculateRoomSettlement(room, transactions);

            const now = new Date();
            const settlementHistory = new SettlementHistory();
            const settlementRequestCreationDate = now;
            settlementHistory.from = room.finalSettlementDate;
            settlementHistory.to = new Date();
            settlementHistory.roomId = new Types.ObjectId(roomId);
            settlementHistory.settlementAt = settlementRequestCreationDate;
            settlementHistory.settlementBy = new Types.ObjectId(requesterUserId);
            settlementHistory.totalAmount = detailsAfterCalculate.totalAmount;
            settlementHistory.details = detailsAfterCalculate.details as SettlementDetail[];

            const _transactionService = this.transactionService;
            const settlementHistoryCreated = await this.repository.create(settlementHistory);
            if (settlementHistoryCreated) {
                await this.roomService.update(roomId, {
                    finalSettlementDate: now,
                });
                // Nên xử lý đẩy vào queue xử lí
                await Promise.all(
                    transactions.map(async function (transaction) {
                        return _transactionService.update(transaction._id.toString(), {
                            settlementAt: settlementRequestCreationDate,
                            settlementId: settlementHistoryCreated._id,
                        });
                    }),
                );
                return settlementHistoryCreated.populate('settlementBy details.user');
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async getSettlementByRoom(roomId: string) {
        const room = await this.roomService.findById(roomId);
        if (!room) throw new NotFoundException('Phòng này không tồn tại.');

        const settlements = await this.repository
            .find({
                roomId: new Types.ObjectId(roomId),
            })
            .populate('settlementBy details.user')
            .lean();

        return settlements || [];
    }

    private calculateRoomSettlement(room: Room, transactions: Transaction[]) {
        let totalAmount = 0;
        const details = room.members.reduce((acc, memberId) => {
            acc[memberId.toString()] = {
                user: memberId,
                totalPaid: 0,
                totalPurchased: 0,
                isSettled: false,
            };
            return acc;
        }, {});

        /**
         * 1. Loop qua toàn bộ transaction
         * 2. Mỗi transaction tính cộng dồn amount
         * 3. Tính totalPaid (Số tiền đã trả) cho từng payerId của transaction
         * 4. Tính tổng tỉ lệ (ví dụ 1 1 1 1 = 4)
         * 5. loop qua mảng split và tính tiền đã tiêu của từng thành viên với công thức (transaction.amount*transaction.ratio)/totalRatio (Mục 4)
         */
        transactions.forEach((transaction) => {
            totalAmount += transaction.amount;
            const payerId = transaction.paidBy.toString();
            if (details[payerId]) {
                details[payerId].totalPaid += transaction.amount;
            }

            const totalRatio = transaction.split.reduce((curr, val) => curr + val.ratio, 0);
            transaction.split.forEach((splitDetail) => {
                const userId = splitDetail.user.toString();
                if (details[userId]) {
                    details[userId].totalPurchased +=
                        (transaction.amount * splitDetail.ratio) / totalRatio;
                }
            });
        });

        return {
            totalAmount,
            details: Object.values(details),
        };
    }

    public async updateStatusSettledOfUser(
        requesterUserId: string,
        settlementId: string,
        { isSettled, personUpdatedForSettlementId }: UpdateStatusSettledOfUserRequest,
    ) {
        try {
            const settlement = await this.repository.findById(settlementId).lean();
            if (!settlement) {
                throw new NotFoundException('Dữ liệu tất toán không tồn tại.');
            }

            if (settlement.settlementBy.toString() !== requesterUserId) {
                throw new ForbiddenException('Chỉ người tạo tất toán mới được phép cập nhật.');
            }

            const updatedSettlement = await this.repository.findOneAndUpdate(
                {
                    _id: settlementId,
                    'details.user': personUpdatedForSettlementId,
                },
                {
                    $set: {
                        'details.$.isSettled': isSettled,
                    },
                },
                { new: true },
            );

            if (!updatedSettlement) {
                throw new BadRequestException(
                    'Có lỗi trong quá trình cập nhật trạng thái tất toán của thành viên.',
                );
            }

            const countSettled = updatedSettlement.details.filter((d) => d.isSettled).length;
            let paymentStatus: SETTLEMENT_PAYMENT_STATUS;

            if (countSettled === 0) {
                paymentStatus = SETTLEMENT_PAYMENT_STATUS.NO_ONE_PAID;
            } else if (countSettled < updatedSettlement.details.length) {
                paymentStatus = SETTLEMENT_PAYMENT_STATUS.PAID_IN_PART;
            } else {
                paymentStatus = SETTLEMENT_PAYMENT_STATUS.PAID_IN_FULL;
            }

            // Chỉ update nếu paymentStatus thay đổi
            if (paymentStatus !== updatedSettlement.paymentStatus) {
                updatedSettlement.paymentStatus = paymentStatus;
                await this.repository.findByIdAndUpdate(settlementId, { paymentStatus });
            }

            return updatedSettlement.populate('settlementBy details.user');
        } catch (error) {
            throw error;
        }
    }

    private validateCreateSettlementTransaction(
        requesterUserId: string,
        room: Room | null,
    ): asserts room is Room {
        if (!room) throw new NotFoundException('Phòng không tồn tại.');
        if (!checkElementInArrayObjectId(room.members, requesterUserId))
            throw new BadRequestException(
                'Người tạo quyết toán không phải là thành viên trong phòng.',
            );
    }
}
