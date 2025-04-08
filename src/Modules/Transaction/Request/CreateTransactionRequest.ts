import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
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
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId({ message: Messages.IS_NOT_MONGO_ID })
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    ratio: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    share: number;
}

export default class CreateTransactionRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(0, 1024)
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @Length(0, 2048)
    description?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId({ message: Messages.IS_NOT_MONGO_ID })
    paidBy: string;

    @ApiProperty({ type: [CreateTransactionSplitRequest] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTransactionSplitRequest)
    split: CreateTransactionSplitRequest[];
}
