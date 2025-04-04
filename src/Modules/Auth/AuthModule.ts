import { Module } from "@nestjs/common";
import AuthController from "./AuthController";
import { AuthService } from "./AuthService";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {

}