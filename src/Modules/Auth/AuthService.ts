import { Injectable } from "@nestjs/common";
import BaseService from "src/Core/Base/BaseService";

@Injectable()
export class AuthService extends BaseService {
    constructor() {
        super()
    }
}