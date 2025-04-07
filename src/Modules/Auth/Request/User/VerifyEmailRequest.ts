import { IsNotEmpty, IsString } from 'class-validator';

export default class UserVerifyEmailRequest {
    @IsNotEmpty()
    @IsString()
    token: string;
}
