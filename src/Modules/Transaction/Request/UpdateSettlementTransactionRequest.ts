import { IsEnum } from 'class-validator';
import { SETTLEMENT_PAYMENT_STATUS } from '../Entity/SettlementHistory';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateSettlementTransactionRequest {
    @ApiProperty({
        example: SETTLEMENT_PAYMENT_STATUS.NO_ONE_PAID,
        enum: SETTLEMENT_PAYMENT_STATUS,
    })
    @IsEnum(SETTLEMENT_PAYMENT_STATUS)
    paymentStatus: SETTLEMENT_PAYMENT_STATUS;
}
