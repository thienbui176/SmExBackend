import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export default class GetTransactionsOfRoomRequest {
    @ApiProperty({ example: new Date('1-4-2025') })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    from: Date;

    @ApiProperty({ example: new Date('1-5-2025') })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    to: Date;
}
