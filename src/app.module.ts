import { Module } from '@nestjs/common';
import { ConfigsModule } from './Configs/ConfigsModule';
import { DatabaseModule } from './Core/Database/DatabaseModule';
import UserModule from './Modules/User/UserModule';
import RoomModule from './Modules/Room/RoomModule';
import { AuthModule } from './Modules/Auth/AuthModule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './Core/Interceptors/TransformInterceptor';

@Module({
    imports: [
        ConfigsModule,
        DatabaseModule,
        UserModule,
        RoomModule,
        AuthModule,
    ],
    providers: [{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor }],
})
export class AppModule {}
