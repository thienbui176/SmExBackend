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
import BaseController from 'src/Core/Base/BaseController';
import TransactionService from './Services/TransactionService';
import { Request } from 'express';
import CreateTransactionRequest from './Request/CreateTransactionRequest';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import GetTransactionsOfRoomRequest from './Request/GetTransactionOfRoomRequest';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import Messages from 'src/Core/Messages/Messages';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import UpdateTransactionRequest from './Request/UpdateTransactionRequest';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import { IsMongoIdParam } from 'src/Core/Validations/IsMongoIdParam';
import TransactionHistoryService from './Services/TransactionHistoryService';
import SettlementTransactionRequest from './Request/SettlementTransactionRequest';
import SettlementService from './Services/SettlementService';

@ApiBearerAuth('jwt-access-token')
@Controller('room/:roomId/transaction')
export default class TransactionController extends BaseController {
    constructor(
        private readonly transactionService: TransactionService,
        private readonly transactionHistoryService: TransactionHistoryService,
    ) {
        super();
    }

    @Post()
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_TSS_001)
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

    @Get()
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_TSS_002)
    public async getTransactionsOfRoom(
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Query() getTransactionsOfRoomRequest: GetTransactionsOfRoomRequest,
    ) {
        return this.transactionService.getTransactionOfRoom(roomId, getTransactionsOfRoomRequest);
    }

    @Delete(':transactionId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_TSS_003)
    public async deleteTransaction(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Param('transactionId', IsMongoIdParam) transactionId: string,
    ) {
        return this.transactionService.removeTransaction(
            transactionId,
            roomId,
            getUserIdFromRequest(request),
        );
    }

    @Patch(':transactionId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_TSS_005)
    public async updateTransaction(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Param('transactionId', IsMongoIdParam) transactionId: string,
        @Body() updateTransactionRequest: UpdateTransactionRequest,
    ) {
        return this.transactionService.updateTransaction(
            transactionId,
            updateTransactionRequest,
            roomId,
            getUserIdFromRequest(request),
        );
    }

    @Get(':transactionId/history')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy danh sách lịch sử giao dịch thành công.')
    public async getHistoryOfTransaction(
        @Param('transactionId', IsMongoIdParam) transactionId: string,
        @Query() paginationRequest: PaginationRequest,
    ) {
        return this.transactionHistoryService.getTransactionHistoryByTransactionIdWithPagination(
            transactionId,
            paginationRequest,
        );
    }

   
}
