import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class ChangePasswordRequest {
    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @ApiProperty({ example: '654321' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 52)
    newPassword: string;
}
