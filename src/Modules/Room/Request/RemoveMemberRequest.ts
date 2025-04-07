import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export default class RemoveMemberRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    memberIdRemove: string;
}
