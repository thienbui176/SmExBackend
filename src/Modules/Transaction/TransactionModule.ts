import { Module } from '@nestjs/common';
import TransactionService from './Services/TransactionService';
import RoomModule from '../Room/RoomModule';
import TransactionController from './TransactionController';
import RoomService from '../Room/RoomService';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './Entity/Transaction';
import UserModule from '../User/UserModule';
import TransactionHistory, { TransactionHistorySchema } from './Entity/TransactionHistory';
import SettlementService from './Services/SettlementService';
import SettlementHistory, { SettlementHistorySchema } from './Entity/SettlementHistory';
import TransactionHistoryService from './Services/TransactionHistoryService';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Transaction.name, schema: TransactionSchema },
            { name: TransactionHistory.name, schema: TransactionHistorySchema },
            { name: SettlementHistory.name, schema: SettlementHistorySchema },
        ]),
        RoomModule,
        UserModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService, TransactionHistoryService, RoomService, SettlementService],
    exports: [TransactionService, MongooseModule],
})
export default class TransactionModule {}
