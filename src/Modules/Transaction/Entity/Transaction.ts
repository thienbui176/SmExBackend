import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/Core/Base/Entity/BaseEntity';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ versionKey: false, collection: 'SMEX_Transaction' })
export class Transaction extends BaseEntity {
    @Prop({ type: String, required: true, maxlength: 1024 })
    title: string;

    @Prop({ type: String, maxlength: 2048 })
    description?: string;

    @Prop({ type: Number, required: true, min: 0 })
    amount: number;

    @Prop({ ref: 'Room', type: Types.ObjectId, required: true })
    roomId: Types.ObjectId;

    @Prop({ type: Date, default: new Date() })
    dateOfPurchase: Date;

    @Prop({ ref: 'User', type: Types.ObjectId, required: true })
    paidBy: Types.ObjectId;

    @Prop({ ref: 'User', type: Types.ObjectId, required: true })
    createdBy: Types.ObjectId;

    @Prop({
        type: [
            {
                userId: { ref: 'User', type: Types.ObjectId, required: true },
                ratio: { type: Number, required: true, min: 0 },
                share: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
    })
    split: {
        userId: Types.ObjectId;
        ratio: number;
        share: number;
    }[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
