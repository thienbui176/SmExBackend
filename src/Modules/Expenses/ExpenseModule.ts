import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './Entity/Expense';
import ExpenseService from './ExpenseService';
import ExpenseController from './ExpenseController';

@Module({
    imports: [MongooseModule.forFeature([{name: Expense.name, schema: ExpenseSchema}])],
    providers: [ExpenseService],
    controllers: [ExpenseController],
    exports: [MongooseModule, ExpenseService]
})
export default class ExpenseModule {}
