import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import SettlementHistory, { SettlementDetail } from '../Entity/SettlementHistory';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../Entity/Transaction';
import { Room } from '../../Room/Entity/Room';
import RoomService from '../../Room/RoomService';
import TransactionService from './TransactionService';
import SettlementTransactionRequest from '../Request/SettlementTransactionRequest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/Modules/User/UserService';
import {
    calculateDateDiffInDays,
    checkElementInArrayObjectId,
    convertDateToDDMMYYYY,
} from 'src/Core/Utils/Helpers';

export default class SettlementService extends AbstractCrudService<SettlementHistory> {
    constructor(
        @InjectModel(SettlementHistory.name)
        protected readonly repository: Model<SettlementHistory>,
        private readonly roomService: RoomService,
        private readonly transactionService: TransactionService,
    ) {
        super(repository);
    }

    public async createSettlementTransaction(
        requesterUserId: string,
        roomId: string,
        settlementTransactionRequest: SettlementTransactionRequest,
    ) {
        try {
            const room = await this.roomService.findById(roomId);
            this.validateCreateSettlementTransaction(
                requesterUserId,
                room,
                settlementTransactionRequest,
            );
            const transactions = await this.transactionService.findAll({
                // Chỉ thực hiện tính cho những giao dịch chưa được tính.
                settlementId: { $eq: null },
                roomId: new Types.ObjectId(roomId),
                dateOfPurchase: {
                    $gte: new Date(settlementTransactionRequest.from),
                    $lte: new Date(settlementTransactionRequest.to),
                },
            });

            if (!transactions.length)
                throw new NotFoundException(
                    `Không có giao dịch nào trong khoảng thời gian từ ${convertDateToDDMMYYYY(settlementTransactionRequest.from)} đến ${convertDateToDDMMYYYY(settlementTransactionRequest.to)}`,
                );

            const detailsAfterCalculate = this.calculateRoomSettlement(room, transactions);

            const settlementHistory = new SettlementHistory();
            const settlementRequestCreationDate = new Date();
            settlementHistory.from = settlementTransactionRequest.from;
            settlementHistory.to = settlementTransactionRequest.to;
            settlementHistory.roomId = new Types.ObjectId(roomId);
            settlementHistory.settlementAt = settlementRequestCreationDate;
            settlementHistory.settlementBy = new Types.ObjectId(requesterUserId);
            settlementHistory.totalAmount = detailsAfterCalculate.totalAmount;
            settlementHistory.details = detailsAfterCalculate.details as SettlementDetail[];

            const _transactionService = this.transactionService;
            const settlementHistoryCreated = await this.repository.create(settlementHistory);
            if (settlementHistoryCreated) {
                // Nên xử lý đẩy vào queue xử lí
                await Promise.all(
                    transactions.map(async function (transaction) {
                        return _transactionService.update(transaction['_id'], {
                            settlementAt: settlementRequestCreationDate,
                            settlementId: settlementHistoryCreated._id,
                        });
                    }),
                );
            }
            return settlementHistoryCreated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public updateSettlement() {}

    private calculateRoomSettlement(room: Room, transactions: Transaction[]) {
        let totalAmount = 0;
        const details = room.members.reduce((acc, memberId) => {
            acc[memberId.toString()] = {
                userId: memberId,
                totalPaid: 0,
                totalPurchased: 0,
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
                const userId = splitDetail.userId.toString();
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

    private validateCreateSettlementTransaction(
        requesterUserId: string,
        room: Room | null,
        settlementTransactionRequest: SettlementTransactionRequest,
    ): asserts room is Room {
        if (!room) throw new NotFoundException('Phòng không tồn tại.');
        if (!checkElementInArrayObjectId(room.members, requesterUserId))
            throw new BadRequestException(
                'Người tạo quyết toán không phải là thành viên trong phòng.',
            );

        const days = calculateDateDiffInDays(
            settlementTransactionRequest.from,
            settlementTransactionRequest.to,
        );
        if (days < 0)
            throw new BadRequestException('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.');

        if (days > 365)
            throw new BadRequestException('Khoảng thời gian không được vượt quá 1 năm.');
    }
}
