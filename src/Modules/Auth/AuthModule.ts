import { Module } from '@nestjs/common';
import AuthController from './AuthController';
import { AuthUserService } from './AuthUserService';
import UserModule from '../User/UserModule';
import TokenModule from 'src/Providers/Token/TokenModule';
import MailModule from 'src/Providers/Mailer/MailModule';
import { JwtAccessStrategy } from './Strategies/JwtAccessStrategy';

@Module({
    imports: [UserModule, TokenModule, MailModule],
    controllers: [AuthController],
    providers: [AuthUserService, JwtAccessStrategy],
    exports: [AuthUserService],
})
export class AuthModule {}
