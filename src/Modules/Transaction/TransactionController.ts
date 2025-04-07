import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import BaseController from 'src/Core/Base/BaseController';
import TransactionService from './TransactionService';
import { Request } from 'express';
import CreateTransactionRequest from './Request/CreateTransactionRequest';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import GetTransactionsOfRoomRequest from './Request/GetTransactionOfRoomRequest';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import Messages from 'src/Core/Messages/Messages';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';

@ApiBearerAuth('jwt-access-token')
@Controller('room/:roomId/transaction')
export default class TransactionController extends BaseController {
    constructor(private readonly transactionService: TransactionService) {
        super();
    }

    @Post()
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_TSS_001)
    public async createTransaction(
        @Req() request: Request,
        @Param('roomId') roomId: string,
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
        @Param('roomId') roomId: string,
        @Query() getTransactionsOfRoomRequest: GetTransactionsOfRoomRequest,
    ) {
        return this.transactionService.getTransactionOfRoom(roomId, getTransactionsOfRoomRequest);
    }

    @Delete(':transactionId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_TSS_003)
    public async deleteTransaction(
        @Req() request: Request,
        @Param('roomId') roomId: string,
        @Param('transactionId') transactionId: string,
    ) {
        return this.transactionService.removeTransaction(
            transactionId,
            roomId,
            getUserIdFromRequest(request),
        );
    }
}
