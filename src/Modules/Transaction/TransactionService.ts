import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { Transaction } from './Entity/Transaction';
import {
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import CreateTransactionRequest from './Request/CreateTransactionRequest';
import RoomService from '../Room/RoomService';
import Messages from 'src/Core/Messages/Messages';
import GetTransactionsOfRoomRequest, {
    TRANSACTION_SORT_BY,
} from './Request/GetTransactionOfRoomRequest';
import { calculateDateDiffInDays, transformOrderByToNumber } from 'src/Core/Utils/Helpers';
import { Room } from '../Room/Entity/Room';
import UpdateTransactionRequest from './Request/UpdateTransactionRequest';
import TransactionHistoryService from './TransactionHistoryService';
import { TRANSACTION_HISTORY_ACTION } from './Entity/TransactionHistory';

@Injectable()
export default class TransactionService extends AbstractCrudService<Transaction> {
    constructor(
        @InjectModel(Transaction.name)
        protected readonly repository: Model<Transaction>,
        private readonly roomService: RoomService,
        private readonly transactionHistoryService: TransactionHistoryService,
    ) {
        super(repository);
    }

    /**
     * @param creatorId
     * @param roomId
     * @param createTransactionRequest
     * @returns
     */
    public async createTransaction(
        creatorId: string,
        roomId: string,
        createTransactionRequest: CreateTransactionRequest,
    ) {
        try {
            await this.validateCreateTransaction(creatorId, roomId, createTransactionRequest);

            const transaction = new Transaction();
            transaction.amount = createTransactionRequest.amount;
            transaction.createdBy = new Types.ObjectId(creatorId);
            transaction.description = createTransactionRequest.description;
            transaction.paidBy = new Types.ObjectId(createTransactionRequest.paidBy);
            transaction.roomId = new Types.ObjectId(roomId);
            transaction.title = createTransactionRequest.title;
            transaction.dateOfPurchase = createTransactionRequest.dateOfPurchase;

            transaction.split = createTransactionRequest.split.map((val) => ({
                ...val,
                userId: new Types.ObjectId(val.userId),
            }));

            const transactionCreated = await this.repository.create(transaction);
            if (transactionCreated) {
                // Lưu lại lịch sử của giao dịch
                this.transactionHistoryService.create({
                    action: TRANSACTION_HISTORY_ACTION.CREATE,
                    newValue: JSON.stringify(transactionCreated),
                    changedBy: new Types.ObjectId(creatorId),
                    transactionId: transactionCreated._id,
                });
            }
            return transactionCreated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param roomId
     * @param getTransactionOfRoomRequest
     * @returns
     */
    public async getTransactionOfRoom(
        roomId: string,
        getTransactionOfRoomRequest: GetTransactionsOfRoomRequest,
    ) {
        try {
            await this.validateGetTransactionOfRoom(roomId, getTransactionOfRoomRequest);

            const conditionGetTransactionOfRoom: RootFilterQuery<Transaction> = {
                roomId: new Types.ObjectId(roomId),
                dateOfPurchase: {
                    $gte: new Date(getTransactionOfRoomRequest.from),
                    $lte: new Date(getTransactionOfRoomRequest.to),
                },
            };
            const sortArgs = {};
            const orderBy = transformOrderByToNumber(getTransactionOfRoomRequest.orderBy);
            switch (getTransactionOfRoomRequest.sortBy) {
                case TRANSACTION_SORT_BY.createdAt:
                    sortArgs['createdAt'] = orderBy;
                    break;
                case TRANSACTION_SORT_BY.dateOfPurchase:
                    sortArgs['dateOfPurchase'] = orderBy;
                    break;
            }

            const transactions = await this.repository
                .find(conditionGetTransactionOfRoom)
                .sort(sortArgs)
                .lean();
            return transactions;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param transactionId
     * @param roomId
     * @param requesterUserId
     * @returns
     */
    public async removeTransaction(transactionId: string, roomId: string, requesterUserId: string) {
        try {
            const [transaction, room] = await Promise.all([
                this.repository.findById(transactionId),
                this.roomService.findById(roomId),
            ]);

            await this.validateTransactionAndRoom(transaction, room, requesterUserId);
            const transactionRemoved = await this.repository.findByIdAndUpdate(transactionId, {
                /** Xoá mềm để ghi lại những giao dịch đã xoá */
                deletedAt: new Date(),
            });
            if (transactionRemoved) {
                /** Thực hiện ghi lại lịch sử xoá giao dịch này */
                await this.transactionHistoryService.create({
                    changedBy: new Types.ObjectId(requesterUserId),
                    action: TRANSACTION_HISTORY_ACTION.DELETE,
                    transactionId: new Types.ObjectId(transactionId),
                });
            }

            return !!transactionRemoved;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param transactionId
     * @param roomId
     * @param requesterUserId
     */
    public async updateTransaction(
        transactionId: string,
        updateTransactionRequest: UpdateTransactionRequest,
        roomId: string,
        requesterUserId: string,
    ) {
        try {
            const [transaction, room] = await Promise.all([
                this.repository.findById(transactionId),
                this.roomService.findById(roomId),
            ]);

            await this.validateUpdateTransaction(
                transaction,
                room,
                updateTransactionRequest,
                requesterUserId,
            );

            let splitConvertedUserIdToObjectId;
            if (updateTransactionRequest.split) {
                splitConvertedUserIdToObjectId = updateTransactionRequest.split.map((val) => ({
                    ...val,
                    userId: new Types.ObjectId(val.userId),
                }));
            }

            const transactionUpdated = await this.repository.findByIdAndUpdate(transactionId, {
                ...updateTransactionRequest,
                split: splitConvertedUserIdToObjectId,
            });

            if (transactionUpdated) {
                /** Thực hiện ghi lại lịch sử cho thay đổi giao dịch (!!!!IMPORTANT) */
                await this.transactionHistoryService.create({
                    changedBy: new Types.ObjectId(requesterUserId),
                    action: TRANSACTION_HISTORY_ACTION.UPDATE,
                    transactionId: new Types.ObjectId(transactionId),
                    oldValue: JSON.stringify(transaction),
                    newValue: JSON.stringify(updateTransactionRequest),
                });
            }

            return transactionUpdated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    private async validateGetTransactionOfRoom(
        roomId: string,
        getTransactionOfRoomRequest: GetTransactionsOfRoomRequest,
    ) {
        const room = await this.roomService.findById(roomId);
        if (!room) throw new NotFoundException(Messages.MSG_015);

        const days = calculateDateDiffInDays(
            getTransactionOfRoomRequest.from,
            getTransactionOfRoomRequest.to,
        );
        if (days < 0)
            throw new BadRequestException('Ngày bắt đầu phải trước hoặc bằng ngày kết thúc');

        if (days > 31)
            throw new BadRequestException('Khoảng thời gian không được vượt quá 1 tháng');
    }

    private async validateUpdateTransaction(
        transaction: Transaction | null,
        room: Room | null,
        updateTransactionRequest: UpdateTransactionRequest,
        requesterUserId: string,
    ) {
        await this.validateTransactionAndRoom(transaction, room, requesterUserId);

        if (!room?.members.includes(new Types.ObjectId(updateTransactionRequest.paidBy)))
            throw new BadGatewayException('Người thanh toán không tồn tại trong phòng.');

        if (updateTransactionRequest.split) {
            updateTransactionRequest.split.forEach((val) => {
                if (!room.members.includes(new Types.ObjectId(val.userId)))
                    throw new NotFoundException('Người được chia tiền không tồn tại trong phòng.');
            });
        }
    }

    /**
     *
     * @param transaction
     * @param room
     * @param requesterUserId
     */
    private async validateTransactionAndRoom(
        transaction: Transaction | null,
        room: Room | null,
        requesterUserId: string,
    ) {
        /**
         * 1. Kiểm tra giao dịch có tồn tại không
         * 2. Kiểm tra phòng có tồn tại không
         * 3. Kiểm tra xem người thực hiện xoá giao dịch có thuộc phòng hay không
         * 4. Kiểm tra giao dịch có thuộc phòng này hay không
         */
        if (!transaction) throw new NotFoundException(Messages.MSG_TSS_004);
        if (!room) throw new NotFoundException(Messages.MSG_015);

        if (!room.members.includes(new Types.ObjectId(requesterUserId)))
            throw new ForbiddenException(Messages.MSG_030);

        if (transaction.roomId.toString() !== room['_id'])
            throw new BadRequestException(Messages.MSG_TSS_005);
    }

    /**
     *
     * @param creatorId
     * @param roomId
     * @param createTransactionRequest
     */
    private async validateCreateTransaction(
        creatorId: string,
        roomId: string,
        createTransactionRequest: CreateTransactionRequest,
    ) {
        const room = await this.roomService.findById(roomId);
        if (!room) throw new NotFoundException(Messages.MSG_015);

        if (!room.members.includes(new Types.ObjectId(creatorId)))
            throw new BadGatewayException(Messages.MSG_030);

        if (!room.members.includes(new Types.ObjectId(createTransactionRequest.paidBy)))
            throw new BadGatewayException('Người thanh toán không tồn tại trong phòng.');

        /** Kiểm tra user trong split có tồn tại trong phòng hay không */
        createTransactionRequest.split.forEach((val) => {
            if (!room.members.includes(new Types.ObjectId(val.userId)))
                throw new NotFoundException('Người được chia tiền không tồn tại trong phòng.');
        });
    }
}
