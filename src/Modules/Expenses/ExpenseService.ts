import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { Expense } from './Entity/Expense';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import { Model, RootFilterQuery, Types } from 'mongoose';
import CreateExpenseRequest from './Request/CreateExpenseRequets';
import UpdateExpenseRequets from './Request/UpdateExpenseRequest';

@Injectable()
export default class ExpenseService extends AbstractCrudService<Expense> {
    public async getExpensesWithPagination(userId: string, paginationRequest: PaginationRequest) {
        try {
            const conditionGetListExpense: RootFilterQuery<Expense> = {
                userId: new Types.ObjectId(userId),
            };
            return this.paginate(
                paginationRequest,
                (skip, limit) => {
                    return this.repository
                        .find(conditionGetListExpense)
                        .skip(skip)
                        .populate('host')
                        .populate('members')
                        .limit(limit)
                        .lean();
                },
                () => this.repository.countDocuments(conditionGetListExpense),
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async createExpense(userId: string, createExpenseRequest: CreateExpenseRequest) {
        try {
            const expense = new Expense();
            expense.amount = createExpenseRequest.amount;
            expense.dateOfPurchase = createExpenseRequest.dateOfPurchase;
            if (createExpenseRequest.description)
                expense.description = createExpenseRequest.description;
            expense.userId = new Types.ObjectId(userId);
            expense.title = createExpenseRequest.title;

            const expenseCreated = await this.repository.create(expense);
            if (expenseCreated) return expenseCreated;
            throw new BadRequestException('Có lỗi trong quá trình tạo chi tiêu.');
        } catch (error) {
            throw error;
        }
    }

    public async updateExpense(expenseId: string, updateExpenseRequest: UpdateExpenseRequets) {
        
    }
}
