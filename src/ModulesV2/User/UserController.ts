import {
    Body,
    Controller,
    Get,
    Inject,
    Logger,
    Patch,
    Post,
    Query,
    Req,
    Response,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { getUserIdFromRequest, getUserIdFromRequestNumber } from 'src/Core/Utils/Helpers';
import { Request } from 'express';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import { ApiBearerAuth } from '@nestjs/swagger';
import SearchUserRequest from './Request/SearchUserRequest';
import { RemoveUndefinedPipe } from 'src/Core/Pipes/RemoveUndefinedPipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAccessAuthGuard } from 'src/Modules/Auth/Guards/JwtAccessGuard';
import UpdateUserProfileRequest from './Request/UpdateUserProfileRequest';
import { UserService } from './UserService';

@ApiBearerAuth('jwt-access-token')
@Controller('/v2/users')
export class UserController {
    constructor(@Inject() private readonly userService: UserService) {}

    @Get('/profile')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Lấy thông tin người dùng thành công.')
    getProfile(@Req() request: Request) {
        return this.userService.getProfile(getUserIdFromRequestNumber(request));
    }

    @Get('/search')
    @ResponseMessage('Lấy thông tin người dùng thành công.')
    search(@Query() searchUserRequest: SearchUserRequest) {
        return this.userService.searchUser(searchUserRequest);
    }

    @Patch('/update-profile')
    @UseGuards(JwtAccessAuthGuard)
    @ResponseMessage('Cập nhật thông tin thành công.')
    updateProfileUser(
        @Req() req: Request,
        @Body(new RemoveUndefinedPipe()) updateProfileUserRequest: UpdateUserProfileRequest,
    ) {
        return this.userService.updateProfileUser(
            getUserIdFromRequestNumber(req),
            updateProfileUserRequest,
        );
    }

    @Patch('/update-photo')
    @UseGuards(JwtAccessAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ResponseMessage('Cập nhật hình đại diện thành công.')
    updatePhoto(@Req() req: Request, @UploadedFile('file') file: Express.Multer.File) {
        return this.userService.updatePhoto(getUserIdFromRequestNumber(req), file);
    }
}
