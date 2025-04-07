import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export default class CreateRoomRequest {
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

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    members: string[];
    hostId: string;
}
