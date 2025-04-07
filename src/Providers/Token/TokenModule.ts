import { Module } from '@nestjs/common';
import TokenService from './TokenService';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            signOptions: { algorithm: 'HS256' },
        }),
    ],
    providers: [TokenService],
    exports: [JwtModule, TokenService],
})
export default class TokenModule {}
