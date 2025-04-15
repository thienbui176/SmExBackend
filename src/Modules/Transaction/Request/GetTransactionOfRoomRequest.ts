import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ORDER_BY } from 'src/Constants/OrderBy';

export enum TRANSACTION_SORT_BY {
    createdAt = 'createdAt',
    dateOfPurchase = 'dateOfPurchase',
}

export default class GetTransactionsOfRoomRequest {
    @ApiProperty({ example: new Date('2025-04-01') })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    from: Date;

    @ApiProperty({ example: new Date('2025-05-01') })
    @ValidateIf((o) => o.from !== undefined)
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    to: Date;

    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    allUnpaidTransactions: boolean;

    @ApiProperty({
        example: TRANSACTION_SORT_BY.dateOfPurchase,
        enum: TRANSACTION_SORT_BY,
        default: TRANSACTION_SORT_BY.dateOfPurchase,
    })
    @IsEnum(TRANSACTION_SORT_BY)
    sortBy: TRANSACTION_SORT_BY = TRANSACTION_SORT_BY.dateOfPurchase;

    @ApiProperty({ example: ORDER_BY.DESC, enum: ORDER_BY, default: ORDER_BY.DESC })
    @IsEnum(ORDER_BY)
    orderBy: ORDER_BY = ORDER_BY.DESC;
}
