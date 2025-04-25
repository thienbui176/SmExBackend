import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export default class UpdateStatusSettledOfUserRequest {
    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    isSettled: boolean;
}
