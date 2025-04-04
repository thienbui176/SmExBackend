import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { UserService } from "./UserService";

@Controller('/users')
export class UserController {
    constructor(@Inject() private readonly userService: UserService) {}
}