import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export default class GetExpensesRequest {
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
