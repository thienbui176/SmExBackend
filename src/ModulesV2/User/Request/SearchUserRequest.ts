import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import {Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty } from 'class-validator';

export default class SearchUserRequest {
    @ApiProperty({ example: 'buithien.dev@gmail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
