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
    user: Types.ObjectId;

    @Prop({ type: Number, required: true, min: 0 })
    totalPaid: number;

    @Prop({ type: Number, required: true, min: 0 })
    totalPurchased: number;

    @Prop({ type: Boolean, default: false })
    isSettled: boolean;
}

@Schema({ versionKey: false, collection: 'SMEX_SettlementHistory' })
export default class SettlementHistory {
    @Prop({ required: true, type: Types.ObjectId })
    roomId: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: User.name })
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
        type: [
            {
                user: { ref: User.name, type: Types.ObjectId, required: true },
                totalPaid: { type: Number, required: true, min: 0 },
                totalPurchased: { type: Number, required: true, min: 0 },
                isSettled: { type: Boolean, default: false },
            },
        ],
        required: true,
    })
    details: {
        user: Types.ObjectId;
        totalPaid: number;
        totalPurchased: number;
        isSettled: boolean;
    }[];
}

export const SettlementHistorySchema = SchemaFactory.createForClass(SettlementHistory);
