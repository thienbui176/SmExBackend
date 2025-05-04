import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import BaseController from 'src/Core/Base/BaseController';
import SettlementService from './Services/SettlementService';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import { IsMongoIdParam } from 'src/Core/Validations/IsMongoIdParam';
import SettlementTransactionRequest from './Request/SettlementTransactionRequest';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import UpdateStatusSettledOfUserRequest from './Request/UpdateStatusSettledOfUserRequest';

@ApiBearerAuth('jwt-access-token')
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
    ) {
        return this.settlementService.createSettlementTransaction(
            getUserIdFromRequest(request),
            roomId,
        );
    }

    @Post(':settlementId/updateStatusSettledOfUser')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Thực hiện cập nhật thanh toán thành công.')
    public async updateStatusSettledOfUser(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Param('settlementId', IsMongoIdParam) settlementId: string,
        @Body() updateStatusSettledOfUserRequest: UpdateStatusSettledOfUserRequest,
    ) {
        return this.settlementService.updateStatusSettledOfUser(
            getUserIdFromRequest(request),
            settlementId,
            updateStatusSettledOfUserRequest,
        );
    }

    @Get('')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy danh sách quyết toán thành công.')
    public async getSettlementsByRoom(@Param('roomId', IsMongoIdParam) roomId: string) {
        return this.settlementService.getSettlementByRoom(roomId);
    }
}
