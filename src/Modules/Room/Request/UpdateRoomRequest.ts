import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export default class UpdateRoomRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(0, 522)
    name: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(0, 1024)
    description?: string;
}
