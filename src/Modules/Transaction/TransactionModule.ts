import { Module } from '@nestjs/common';
import TransactionService from './TransactionService';
import RoomModule from '../Room/RoomModule';
import TransactionController from './TransactionController';
import RoomService from '../Room/RoomService';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './Entity/Transaction';
import UserModule from '../User/UserModule';
import TransactionHistory, { TransactionHistorySchema } from './Entity/TransactionHistory';
import TransactionHistoryService from './TransactionHistoryService';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
            { name: TransactionHistory.name, schema: TransactionHistorySchema },
        ]),
        RoomModule,
        UserModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService, TransactionHistoryService, RoomService],
    exports: [TransactionService, TransactionHistoryService, MongooseModule],
})
export default class TransactionModule {}
