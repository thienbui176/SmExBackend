import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SettlementHistoryDocument = HydratedDocument<SettlementHistory>;

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
    toalAmount: number;

    @Prop({
        type: [
            {
                userId: { ref: 'User', type: Types.ObjectId, required: true },
                totalPaid: { type: Number, required: true, min: 0 },
                totalPurchased: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
    })
    details: {
        userId: Types.ObjectId;
        totalPaid: number;
        totalPurchased: number;
    }[];
}

export const SettlementHistorySchema = SchemaFactory.createForClass(SettlementHistory);
