import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import RoomService from './RoomService';
import BaseController from 'src/Core/Base/BaseController';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import Messages from 'src/Core/Messages/Messages';
import CreateRoomRequest from './Request/CreateRoomRequest';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import { Request } from 'express';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import InviteMemberRequest from './Request/InviteMemberRequest';
import RemoveMemberRequest from './Request/RemoveMemberRequest';
import UpdateRoomRequest from './Request/UpdateRoomRequest';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IsMongoIdParam } from 'src/Core/Validations/IsMongoIdParam';
import TransferHostRequest from './Request/TransferHostRequest';
import UpdateSettingsRoomRequest from './Request/UpdateSettingsRoomRequest';

@ApiBearerAuth('jwt-access-token')
@Controller('/rooms')
export default class RoomController extends BaseController {
    private roomService: RoomService;
    constructor(roomService: RoomService) {
        super();
        this.roomService = roomService;
    }

    @Post()
    @ResponseMessage(Messages.MSG_010)
    @UseGuards(JwtAccessAuthGuard)
    createRoom(@Req() request: Request, @Body() createRoomRequest: CreateRoomRequest) {
        this.logger.log('START CREATE ROOM');
        const result = this.roomService.createRoom(request?.user.sub, createRoomRequest);
        this.logger.log('END CREATE ROOM');
        return result;
    }

    @Get('/my-rooms')
    @ResponseMessage(Messages.MSG_013)
    @UseGuards(JwtAccessAuthGuard)
    getMyRooms(@Req() request: Request, @Query() paginationRequest: PaginationRequest) {
        const userId = getUserIdFromRequest(request);
        return this.roomService.getMyRoomsWithPaginate(userId, paginationRequest);
    }

    @Post('/:roomId/invite-members')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_026)
    inviteMember(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() inviteMemberRequest: InviteMemberRequest,
    ) {
        const userId = getUserIdFromRequest(request);
        return this.roomService.inviteMember(userId, roomId, inviteMemberRequest);
    }

    @Delete('/:roomId/remove-member')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_027)
    removeMember(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() removeMemberRequest: RemoveMemberRequest,
    ) {
        const userId = getUserIdFromRequest(request);
        return this.roomService.removeMember(userId, roomId, removeMemberRequest.memberIdRemove);
    }

    @Patch('/:roomId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_028)
    updateRoom(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() updateRoomRequest: UpdateRoomRequest,
    ) {
        const userId = getUserIdFromRequest(request);
        return this.roomService.updateRoom(userId, roomId, updateRoomRequest);
    }

    @Patch('/:roomId/settings')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Cập nhật cài đặt phòng thành công.')
    updateSettingsRoom(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() updateSettingsRoom: UpdateSettingsRoomRequest,
    ) {
        const userId = getUserIdFromRequest(request);
        return this.roomService.updateSettingsRoom(userId, roomId, updateSettingsRoom);
    }

    @Get('/:roomId')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage(Messages.MSG_028)
    getDetailRoomById(@Req() request: Request, @Param('roomId', IsMongoIdParam) roomId: string) {
        const userId = getUserIdFromRequest(request);
        return this.roomService.getDetailRoomById(roomId, userId);
    }

    @Post('/:roomId/transfer-host')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Chuyển quyền chủ phòng thành công.    ')
    transferHost(
        @Req() request: Request,
        @Param('roomId', IsMongoIdParam) roomId: string,
        @Body() transferHostRequest: TransferHostRequest,
    ) {
        return this.roomService.transferHost(
            roomId,
            getUserIdFromRequest(request),
            transferHostRequest.newHostId,
        );
    }
}
