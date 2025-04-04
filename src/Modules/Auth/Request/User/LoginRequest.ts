import { IsEmail, IsNotEmpty, IsObject, IsString, Length, ValidateNested } from "class-validator"

export default class CreateUserRequest {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 64)
    password: string
}