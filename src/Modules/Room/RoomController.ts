import {
    Body,
    Controller,
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
import { AppLogger } from 'src/Core/Logger/AppLogger';
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
    createRoom(
        @Req() request: Request,
        @Body() createRoomRequest: CreateRoomRequest,
    ) {
        this.logger.log('START CREATE ROOM');
        const result = this.roomService.createRoom(
            request?.user.sub,
            createRoomRequest,
        );
        this.logger.log('END CREATE ROOM');
        return result;
    }

    @Get('/my-rooms')
    @ResponseMessage(Messages.MSG_013)
    @UseGuards(JwtAccessAuthGuard)
    getMyRooms(
        @Req() request: Request,
        @Query() paginationRequest: PaginationRequest,
    ) {
        const userId = request.user.sub;
        return this.roomService.getMyRoomsWithPaginate(
            userId,
            paginationRequest,
        );
    }

    @Post('/:roomId/invite-members')
    @ResponseMessage(Messages.MSG_026)
    inviteMember(
        @Req() request: Request,
        @Param('roomId') roomId: string,
        @Body() inviteMemberRequest: InviteMemberRequest,
    ) {
        const userId = request.user.sub;
        return this.roomService.inviteMember(
            userId,
            roomId,
            inviteMemberRequest,
        );
    }

    @Post('/:roomId/remove-member')
    @ResponseMessage(Messages.MSG_027)
    removeMember(
        @Req() request: Request,
        @Param('roomId') roomId: string,
        @Body() removeMemberRequest: RemoveMemberRequest,
    ) {
        const userId = request.user.sub;
        return this.roomService.removeMember(
            userId,
            roomId,
            removeMemberRequest.memberIdRemove,
        );
    }

    @Patch('/:roomId')
    @ResponseMessage(Messages.MSG_028)
    updateRoom(
        @Req() request: Request,
        @Param('roomId') roomId: string,
        @Body() updateRoomRequest: UpdateRoomRequest,
    ) {
        const userId = request.user.sub;
        return this.roomService.updateRoom(userId, roomId, updateRoomRequest);
    }
}
