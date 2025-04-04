import { Module } from '@nestjs/common';
import { ConfigsModule } from './Configs/ConfigsModule';
import { DatabaseModule } from './Core/Database/DatabaseModule';
import UserModule from './Modules/User/UserModule';
import RoomModule from './Modules/Room/RoomModule';

@Module({
  imports: [ConfigsModule, DatabaseModule, UserModule, RoomModule],
})
export class AppModule {}
