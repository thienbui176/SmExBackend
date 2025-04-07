import { Module } from '@nestjs/common';
import RoomController from './RoomController';
import RoomService from './RoomService';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './Entity/Room';
import UserModule from '../User/UserModule';
import { UserService } from '../User/UserService';

@Module({
    imports: [MongooseModule.forFeature([{ schema: RoomSchema, name: Room.name }]), UserModule],
    controllers: [RoomController],
    providers: [RoomService],
    exports: [RoomService, MongooseModule],
})
export default class RoomModule {}
