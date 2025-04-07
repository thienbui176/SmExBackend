import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export default class UserLoginRequest {
    @ApiProperty({ example: 'thienbuiduy.work@gmail.com' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 64)
    password: string;
}
