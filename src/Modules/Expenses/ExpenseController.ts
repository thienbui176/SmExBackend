import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import BaseController from 'src/Core/Base/BaseController';
import ExpenseService from './ExpenseService';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import Messages from 'src/Core/Messages/Messages';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';

@ApiBearerAuth('jwt-access-token')
@Controller('/expense')
export default class ExpenseController extends BaseController {
    constructor(private readonly ExpenseService: ExpenseService) {
        super();
    }

    @Post()
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Taoj')
    public async createTransaction(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() createTransactionRequest: CreateTransactionRequest,
    ) {
        return this.transactionService.createTransaction(
            getUserIdFromRequest(request),
            roomId,
            createTransactionRequest,
        );
    }
}
