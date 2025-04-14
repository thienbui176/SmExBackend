import { Controller, Get, Inject, Logger, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './UserService';
import { getUserIdFromRequest } from 'src/Core/Utils/Helpers';
import { Request } from 'express';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import { JwtAccessAuthGuard } from '../Auth/Guards/JwtAccessGuard';
import { ApiBearerAuth } from '@nestjs/swagger';
import SearchUserRequest from './Request/SearchUserRequest';

@ApiBearerAuth('jwt-access-token')
@Controller('/users')
export class UserController {
    constructor(@Inject() private readonly userService: UserService) {}

    @Get('/profile')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy thông tin người dùng thành công.')
    getProfile(@Req() request: Request) {
        return this.userService.getProfile(getUserIdFromRequest(request));
    }

    @Get('/search')
    @ResponseMessage('Lấy thông tin người dùng thành công.')
    search(@Query() searchUserRequest: SearchUserRequest) {
        return this.userService.searchUser(searchUserRequest)
    }
}
