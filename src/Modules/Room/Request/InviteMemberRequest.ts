import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export default class InviteMemberRequest {
    @ApiProperty()
    @IsArray()
    @IsMongoId({ each: true })
    invitees: string[];
}
