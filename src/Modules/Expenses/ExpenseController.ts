import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import BaseController from 'src/Core/Base/BaseController';
import ExpenseService from './ExpenseService';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import CreatExpenseRequest from './Request/CreateExpenseRequets';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import { Request } from 'express';
import GetExpensesRequest from './Request/GetExpensesRequest';
import UpdateExpenseRequets from './Request/UpdateExpenseRequest';

@ApiBearerAuth('jwt-access-token')
@Controller('/expense')
export default class ExpenseController extends BaseController {
    constructor(private readonly ExpenseService: ExpenseService) {
        super();
    }

    @Post()
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Tạo chi tiêu thành công.')
    public async createExpense(
        @Req() request: Request,
        @Body() createExpenseRequest: CreatExpenseRequest,
    ) {
        return this.ExpenseService.createExpense(
            getUserIdFromRequest(request),
            createExpenseRequest,
        );
    }

    @Get()
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy danh sách chi tiêu thành công.')
    public async getExpenses(@Req() request: Request, @Query() getExpenses: GetExpensesRequest) {
        return this.ExpenseService.getExpenses(getUserIdFromRequest(request), getExpenses);
    }

    @Get(':id')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy chi tiết chi tiêu thành công.')
    public async getDetailExpense(@Param('id') id: string) {
        return this.ExpenseService.getDetailExpense(id);
    }

    @Patch('/:expenseId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy danh sách chi tiêu thành công.')
    public async updateExpenses(
        @Param('expenseId') expenseId: string,
        @Body() updateExpense: UpdateExpenseRequets,
    ) {
        return this.ExpenseService.updateExpense(expenseId, updateExpense);
    }

    @Delete('/:expenseId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy danh sách chi tiêu thành công.')
    public async deleteExpense(@Param('expenseId') expenseId: string) {
        return this.ExpenseService.deleteExpense(expenseId);
    }
}
