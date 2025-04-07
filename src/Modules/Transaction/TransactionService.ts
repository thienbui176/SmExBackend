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
import GetTransactionsOfRoomRequest from './Request/GetTransactionOfRoomRequest';
import { calculateDateDiffInDays } from 'src/Core/Utils/Helpers';

@Injectable()
export default class TransactionService extends AbstractCrudService<Transaction> {
    constructor(
        @InjectModel(Transaction.name)
        protected readonly repository: Model<Transaction>,
        private readonly roomService: RoomService,
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
            const room = await this.roomService.findById(roomId);
            if (!room) throw new NotFoundException(Messages.MSG_015);

            if (!room.members.includes(new Types.ObjectId(creatorId)))
                throw new BadGatewayException(Messages.MSG_030);

            if (!room.members.includes(new Types.ObjectId(createTransactionRequest.paidBy)))
                throw new BadGatewayException('Người thanh toán không tồn tại trong phòng.');

            const transaction = new Transaction();
            transaction.amount = createTransactionRequest.amount;
            transaction.createdBy = new Types.ObjectId(creatorId);
            transaction.description = createTransactionRequest.description;
            transaction.paidBy = new Types.ObjectId(createTransactionRequest.paidBy);
            transaction.roomId = new Types.ObjectId(roomId);
            transaction.title = createTransactionRequest.title;

            /** Kiểm tra user trong split có tồn tại trong phòng hay không */
            createTransactionRequest.split.forEach((val) => {
                if (!room.members.includes(new Types.ObjectId(val.userId)))
                    throw new NotFoundException('Người được chia tiền không tồn tại trong phòng.');
            });

            transaction.split = createTransactionRequest.split.map((val) => ({
                ...val,
                userId: new Types.ObjectId(val.userId),
            }));

            const transactionCreated = await this.repository.create(transaction);
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

            const conditionGetTransactionOfRoom: RootFilterQuery<Transaction> = {
                roomId: new Types.ObjectId(roomId),
                createdAt: {
                    $gte: new Date(getTransactionOfRoomRequest.from),
                    $lte: new Date(getTransactionOfRoomRequest.to),
                },
            };
            const transactions = await this.repository.find(conditionGetTransactionOfRoom).lean();
            return transactions;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async removeTransaction(transactionId: string, roomId: string, userId: string) {
        try {
            const [transaction, room] = await Promise.all([
                this.repository.findById(transactionId).lean(),
                this.roomService.findById(roomId),
            ]);

            /**
             * 1. Kiểm tra giao dịch có tồn tại không
             * 2. Kiểm tra phòng có tồn tại không
             * 3. Kiểm tra xem người thực hiện xoá giao dịch có thuộc phòng hay không
             * 4. Kiểm tra giao dịch có thuộc phòng này hay không
             */
            if (!transaction) throw new NotFoundException(Messages.MSG_TSS_004);
            if (!room) throw new NotFoundException(Messages.MSG_015);

            if (!room.members.includes(new Types.ObjectId(userId)))
                throw new ForbiddenException(Messages.MSG_030);

            if (transaction.roomId.toString() !== roomId)
                throw new BadRequestException(Messages.MSG_TSS_005);

            const transactionRemoved = await this.repository.findByIdAndUpdate(transactionId, {
                /** Xoá mềm để ghi lại những giao dịch đã xoá */
                deletedAt: new Date(),
            });
            if (transactionRemoved) {
                /** Thực hiện ghi lại lịch sử xoá giao dịch này */
            }

            return !!transactionRemoved;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
