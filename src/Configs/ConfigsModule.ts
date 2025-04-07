import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseConfig from './DatabaseConfig';
import TokenConfig from './TokenConfig';
import MailerConfig from './MailerConfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [DatabaseConfig, TokenConfig, MailerConfig],
            isGlobal: true,
        }),
    ],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigsModule {}
