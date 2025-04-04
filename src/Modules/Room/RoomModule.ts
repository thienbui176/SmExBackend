import { Module } from "@nestjs/common";
import RoomController from "./RoomController";
import RoomServiceImpl from "./RoomService";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "./Entity/Room";
import UserModule from "../User/UserModule";

@Module({
    imports: [MongooseModule.forFeature([{schema: RoomSchema, name: Room.name}]), UserModule],
    controllers: [RoomController],
    providers: [RoomServiceImpl],
    exports: [RoomServiceImpl],
})
export default class RoomModule {

}