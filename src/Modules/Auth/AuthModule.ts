import { Module } from '@nestjs/common';
import AuthController from './AuthController';
import { AuthUserService } from './AuthUserService';
import UserModule from '../User/UserModule';
import TokenModule from 'src/Providers/Token/TokenModule';
import MailModule from 'src/Providers/Mailer/MailModule';

@Module({
    imports: [UserModule, TokenModule, MailModule],
    controllers: [AuthController],
    providers: [AuthUserService],
    exports: [AuthUserService],
})
export class AuthModule {}
