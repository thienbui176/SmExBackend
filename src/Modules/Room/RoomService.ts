import { Injectable } from "@nestjs/common";
import { UserService } from "../User/UserService";
import { Room } from "./Entity/Room";

@Injectable()
export default class RoomService{
    constructor(private readonly userService: UserService){}

    public async createRoom() {
        const users = await this.userService.findAll()
        return users
    }

    public async getRooms(): Promise<Room[]> {
        return []
    }

    public async deleteRoom() {}
}