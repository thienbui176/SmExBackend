import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/Modules/User/Entity/User';

export type SettlementHistoryDocument = HydratedDocument<SettlementHistory>;
export enum SETTLEMENT_PAYMENT_STATUS {
    'NO_ONE_PAID' = 'NO_ONE_PAID',
    'PAID_IN_PART' = 'PAID_IN_PART',
    'PAID_IN_FULL' = 'PAID_IN_FULL',
}

export class SettlementDetail {
    @Prop({ ref: User.name, type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Number, required: true, min: 0 })
    totalPaid: number;

    @Prop({ type: Number, required: true, min: 0 })
    totalPurchased: number;
}

@Schema({ versionKey: false, collection: 'SMEX_SettlementHistory' })
export default class SettlementHistory {
    @Prop({ required: true, type: Types.ObjectId })
    roomId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId })
    settlementBy: Types.ObjectId;

    @Prop({ required: true, type: Date })
    settlementAt: Date;

    @Prop({ type: Date, required: true })
    from: Date;

    @Prop({ type: Date, required: true })
    to: Date;

    @Prop({ type: Number, required: true })
    totalAmount: number;

    @Prop({ type: [String], default: [] })
    billPhotos: string;

    @Prop({ enum: SETTLEMENT_PAYMENT_STATUS, default: SETTLEMENT_PAYMENT_STATUS.NO_ONE_PAID })
    paymentStatus: SETTLEMENT_PAYMENT_STATUS;

    @Prop({
        type: [SettlementDetail],
        required: true,
    })
    details: {
        userId: Types.ObjectId;
        totalPaid: number;
        totalPurchased: number;
    }[];
}

export const SettlementHistorySchema = SchemaFactory.createForClass(SettlementHistory);
