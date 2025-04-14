import JwtPayload from 'src/Core/Interfaces/JwtPayload';
import ITokenService from './Interfaces/ITokenService';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class TokenService implements ITokenService {
    private ACCESS_TOKEN_SECRET: string;
    private REFRESH_TOKEN_SECRET: string;
    private TOKEN_VERIFY_EMAIL_SECRET: string;
    private readonly ACCESS_TOKEN_EXPIRES_IN = '1h';
    private readonly REFRESH_TOKEN_EXPIRES_IN = '7d';
    private readonly TOKEN_VERIFY_EMAIL_EXPIRES_IN = '10m';
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.ACCESS_TOKEN_SECRET = this.configService.getOrThrow('ACCESS_TOKEN_SECRET');
        this.REFRESH_TOKEN_SECRET = this.configService.getOrThrow('REFRESH_TOKEN_SECRET');
        this.TOKEN_VERIFY_EMAIL_SECRET = this.configService.getOrThrow('TOKEN_VERIFY_EMAIL_SECRET');
    }

    generateAccessToken(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.ACCESS_TOKEN_SECRET,
            expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
        });
    }

    generateRefreshToken(payload: JwtPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.REFRESH_TOKEN_SECRET,
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN,
        });
    }

    validateToken(
        token: string,
        type: 'access' | 'refresh' | 'verifyEmail' | 'token' = 'access',
    ): boolean {
        try {
            let secret: string;
            switch (type) {
                case 'access':
                    secret = this.ACCESS_TOKEN_SECRET;
                    break;
                case 'refresh':
                    secret = this.REFRESH_TOKEN_SECRET;
                    break;
                case 'verifyEmail':
                    secret = this.TOKEN_VERIFY_EMAIL_SECRET;
                    break;
                case 'token':
                    secret = 'token-secret';
                default:
                    secret = this.ACCESS_TOKEN_SECRET;
            }
            this.jwtService.verify(token, { secret });
            return true;
        } catch {
            return false;
        }
    }

    getEmail(token: string): string {
        const decoded = this.jwtService.decode<JwtPayload>(token);
        return decoded['email'];
    }

    getId(token: string): string {
        const decoded = this.jwtService.decode<JwtPayload>(token);
        return decoded['sub'];
    }

    getAuthentication(token: string) {
        return this.jwtService.decode(token);
    }

    generateVerifyEmailToken(email: string): string {
        return this.jwtService.sign(
            { email },
            {
                secret: this.TOKEN_VERIFY_EMAIL_SECRET,
                expiresIn: this.TOKEN_VERIFY_EMAIL_EXPIRES_IN,
            },
        );
    }

    generateToken<TokenPayload>(payload: TokenPayload, expiresIn: string) {
        return this.jwtService.sign(payload as any, {
            secret: 'token-secret',
            expiresIn: expiresIn,
        });
    }

    decodeToken<TokenPayload>(token: string) {
        return this.jwtService.decode<TokenPayload>(token);
    }
}
