import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import BaseController from 'src/Core/Base/BaseController';
import SettlementService from './Services/SettlementService';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import { IsMongoIdParam } from 'src/Core/Validations/IsMongoIdParam';
import SettlementTransactionRequest from './Request/SettlementTransactionRequest';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import { Request } from 'express';

@Controller('/:roomId/settlement')
export default class SettlementController extends BaseController {
    constructor(private readonly settlementService: SettlementService) {
        super();
    }

    @Post('')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Thực hiện quyết toán thành công.')
    public async settlementTransaction(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() settlementTransactionRequest: SettlementTransactionRequest,
    ) {
        return this.settlementService.createSettlementTransaction(
            getUserIdFromRequest(request),
            roomId,
            settlementTransactionRequest,
        );
    }
}
