
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    Length,
} from 'class-validator';
import Messages from 'src/Core/Messages/Messages';


export default class CreatExpenseRequest {
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
}
