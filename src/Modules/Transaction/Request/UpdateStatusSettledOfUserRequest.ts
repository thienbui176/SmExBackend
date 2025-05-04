import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export default class UpdateStatusSettledOfUserRequest {
    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    isSettled: boolean;

    @ApiProperty({})
    @IsNotEmpty()
    @IsMongoId()
    personUpdatedForSettlementId: string;
}
