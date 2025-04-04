import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get("MONGODB_URL")
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }