import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsDate, IsNotEmpty } from 'class-validator';

export default class GetTransactionsOfRoomRequest {
    @ApiProperty({ example: new Date('1-4-2025') })
    @IsNotEmpty()
    @IsDate()
    from: Date;

    @ApiProperty({ example: new Date('1-5-2025') })
    @IsNotEmpty()
    @IsDate()
    to: Date;
}
