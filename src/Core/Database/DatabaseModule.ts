import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as env from 'dotenv';
import { User } from 'src/ModulesV2/User/Entity/User';
import Profile from 'src/ModulesV2/User/Entity/Profile';
env.config();

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URL'),
            }),
            inject: [ConfigService],
        }),
        // TypeOrmModule.forRootAsync({
        //     useFactory: () => {
        //         return {
        //             type: 'mysql',
        //             host: process.env.MYSQL_HOST,
        //             port: Number(process.env.MYSQL_PORT) || 3306,
        //             username: process.env.MYSQL_USERNAME,
        //             password: process.env.MYSQL_PW,
        //             database: process.env.MYSQL_DB_NAME,
        //             entities: [User, Profile],
        //             synchronize: process.env.NODE_ENV === 'dev' ? true : false,
        //         };
        //     },
        // }),
    ],
    providers: [],
    exports: [MongooseModule],
})
export class DatabaseModule {}
