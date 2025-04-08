import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import Messages from 'src/Core/Messages/Messages';

export default class RemoveMemberRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId({ message: Messages.IS_NOT_MONGO_ID })
    memberIdRemove: string;
}
