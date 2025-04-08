import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import Messages from 'src/Core/Messages/Messages';

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
    @IsMongoId({ each: true, message: Messages.IS_NOT_MONGO_ID })
    members: string[];
}
