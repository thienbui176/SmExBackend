import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';

export default class SettlementTransactionRequest {
    @ApiProperty({ example: new Date('2025-04-01') })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    from: Date;

    @ApiProperty({ example: new Date('2025-05-01') })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    to: Date;
}
