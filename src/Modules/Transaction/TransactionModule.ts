import { Module } from '@nestjs/common';
import TransactionService from './TransactionService';
import RoomModule from '../Room/RoomModule';
import TransactionController from './TransactionController';
import RoomService from '../Room/RoomService';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './Entity/Transaction';
import UserModule from '../User/UserModule';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
        RoomModule,
        UserModule,
    ],
    controllers: [TransactionController],
    providers: [TransactionService, RoomService],
    exports: [TransactionService, MongooseModule],
})
export default class TransactionModule {}
