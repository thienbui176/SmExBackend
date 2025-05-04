import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { Expense } from './Entity/Expense';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import { Model, RootFilterQuery, Types } from 'mongoose';
import CreateExpenseRequest from './Request/CreateExpenseRequets';
import UpdateExpenseRequets from './Request/UpdateExpenseRequest';
import { InjectModel } from '@nestjs/mongoose';
import GetExpensesRequest from './Request/GetExpensesRequest';
import { calculateDateDiffInDays } from 'src/Core/Utils/Helpers';
import { Transaction } from '../Transaction/Entity/Transaction';
import { User } from '../User/Entity/User';

@Injectable()
export default class ExpenseService extends AbstractCrudService<Expense> {
    constructor(
        @InjectModel(Expense.name)
        protected readonly repository: Model<Expense>,
    ) {
        super(repository);
    }

    public async getExpenses(userId: string, getExpensesRequest: GetExpensesRequest) {
        try {
            const days = calculateDateDiffInDays(getExpensesRequest.from, getExpensesRequest.to);
            if (days <= 0 || days > 90)
                throw new BadRequestException(
                    'Ngày bắt đầu và kết thúc phải cách nhau 1 ngày và bé hơn 90 ngày.',
                );

            const conditionGetListExpense: RootFilterQuery<Expense> = {
                userId: new Types.ObjectId(userId),
                dateOfPurchase: {
                    $gte: new Date(getExpensesRequest.from),
                    $lte: new Date(getExpensesRequest.to),
                },
            };
            return this.repository.find(conditionGetListExpense).populate('rootTransaction').lean();
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public async getDetailExpense(expenseId: string) {
        if (!Types.ObjectId.isValid(expenseId)) {
            throw new NotFoundException('Invalid expense ID');
        }

        const expense = await this.repository
            .findById(expenseId)
            .populate({
                path: 'rootTransaction',
                model: Transaction.name,
                populate: [
                    {
                        path: 'roomId',
                        model: 'Room',
                    },
                    {
                        path: 'paidBy createdBy',
                        model: User.name,
                        select: '-password', // exclude password
                    },
                    {
                        path: 'split.user',
                        model: User.name,
                        select: '-password', // exclude password
                    },
                ],
            })
            .populate({
                path: 'userId',
                model: User.name,
                select: '-password', // in case you want info of the user who created the expense
            })
            .lean();

        if (!expense) {
            throw new NotFoundException('Expense not found');
        }

        return expense;
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
        try {
            const expense = await this.findById(expenseId);
            if (!expense) throw new NotFoundException('Chi tiêu này không tồn tại trong hệ thống.');
            if (expense.rootTransaction)
                throw new NotFoundException(
                    'Không thể cập nhật chi tiêu được đồng bộ từ phòng chung',
                );
            const expenseUpdated = await this.repository.findByIdAndUpdate(expenseId, {
                ...expense,
                ...updateExpenseRequest,
            });
            if (expenseUpdated) return expenseUpdated;
            throw new BadRequestException('Có lỗi trong quá trình cập nhật chi tiêu.');
        } catch (error) {
            throw error;
        }
    }

    public async deleteExpense(expenseId: string) {
        try {
            const expense = await this.findById(expenseId);
            if (!expense) throw new NotFoundException('Chi tiêu này không tồn tại trong hệ thống.');
            if (expense.rootTransaction)
                throw new NotFoundException(
                    'Không thể cập nhật chi tiêu được đồng bộ từ phòng chung',
                );
            if (await this.repository.findByIdAndDelete(expenseId)) return true;
            throw new BadRequestException('Có lỗi trong quá trình xóa chi tiêu.');
        } catch (error) {
            throw error;
        }
    }
}
