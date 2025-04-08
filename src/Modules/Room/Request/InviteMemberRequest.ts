import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import Messages from 'src/Core/Messages/Messages';

export default class InviteMemberRequest {
    @ApiProperty()
    @IsArray()
    @IsMongoId({ each: true, message: Messages.IS_NOT_MONGO_ID })
    invitees: string[];
}
