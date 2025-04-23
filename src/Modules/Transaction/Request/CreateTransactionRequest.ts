import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import Messages from 'src/Core/Messages/Messages';

export class CreateTransactionSplitRequest {
    @ApiProperty({ example: '67f53c1b2bd3c8423ad6b48e' })
    @IsNotEmpty()
    @IsMongoId({ message: Messages.IS_NOT_MONGO_ID })
    userId: string;

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    ratio: number;

    @ApiProperty({ example: 0 })
    @IsNotEmpty()
    @IsNumber()
    share: number;
}

export default class CreateTransactionRequest {
    @ApiProperty({ example: 'Đồ ăn vặt' })
    @IsNotEmpty()
    @IsString()
    @Length(0, 1024)
    title: string;

    @ApiProperty({ required: false, example: 'Snack, coffee' })
    @IsOptional()
    @IsString()
    @Length(0, 2048)
    description?: string;

    @ApiProperty({ example: 300000 })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({ example: new Date('10-4-2025') })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dateOfPurchase: Date;

    @ApiProperty({ example: '67f53c1b2bd3c8423ad6b48e' })
    @IsNotEmpty()Q
    @IsMongoId({ message: Messages.IS_NOT_MONGO_ID })
    paidBy: string;

    @ApiProperty({ type: [CreateTransactionSplitRequest] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTransactionSplitRequest)
    split: CreateTransactionSplitRequest[];
}
