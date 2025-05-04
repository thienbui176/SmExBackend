import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export default class UpdateSettingsRoomRequest {
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categoriesOfExpense?: string[];

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    notifyExpenseNotes?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    createdSettlementNotifications?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    weeklySummaryNotifications?: boolean;

    @ApiProperty()
    @IsOptional()
    @IsString()
    telegramId?: string;
}
