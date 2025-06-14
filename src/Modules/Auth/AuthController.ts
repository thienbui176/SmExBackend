import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import UserLoginRequest from './Request/User/UserLoginRequest';
import { AuthUserService } from './AuthUserService';
import BaseController from 'src/Core/Base/BaseController';
import UserRegisterRequest from './Request/User/UserRegisterRequest';
import { ResponseMessage } from 'src/Core/Metadata/ResponseMessageMetadata';
import Messages from 'src/Core/Messages/Messages';
import UserVerifyEmailRequest from './Request/User/VerifyEmailRequest';
import ChangePasswordRequest from './Request/User/ChangePasswordRequest';

@Controller('/auth')
export default class AuthController extends BaseController {
    private authUserService: AuthUserService;
    constructor(authUserService: AuthUserService) {
        super();
        this.authUserService = authUserService;
    }

    @Post('/user/login')
    @ResponseMessage(Messages.MSG_004)
    userLogin(@Body() userLoginRequest: UserLoginRequest) {
        this.logger.log('START LOGIN USER');
        const result = this.authUserService.login(userLoginRequest);
        this.logger.log('END LOGIN USER');
        return result;
    }

    @Post('/user/register')
    @ResponseMessage(Messages.MSG_003)
    async userRegister(@Body() userRegisterRequest: UserRegisterRequest) {
        this.logger.log('START REGISTER USER');
        const result = await this.authUserService.register(userRegisterRequest);
        this.logger.log('END REGISTER USER');
        return result;
    }

    @Post('/user/verify-email')
    @ResponseMessage(Messages.MSG_009)
    async userVerifyEmail(@Query() userVerifyEmailRequest: UserVerifyEmailRequest) {
        this.logger.log('START VERIFY EMAIL USER');
        const result = await this.authUserService.verifyEmail(userVerifyEmailRequest);
        this.logger.log('END VERIFY EMAIL USER');
        return result;
    }

    @Get('/user/request-change-password')
    @ResponseMessage('Gửi yêu cầu thay đổi mật khẩu thành công. Vui lòng kiểm tra email')
    async requestChangePassword(@Query('email') email: string) {
        return await this.authUserService.requestChangePassword(email);
    }

    @Post('/user/change-password')
    @ResponseMessage('Thay đổi mật khẩu thành công')
    async changePassword(
        @Query('token') token: string,
        @Body() changePasswordRequest: ChangePasswordRequest,
    ) {
        return await this.authUserService.changePassword(token,changePasswordRequest);
    }
}
