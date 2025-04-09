import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/Modules/User/Entity/User';

export type SettlementHistoryDocument = HydratedDocument<SettlementHistory>;

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
