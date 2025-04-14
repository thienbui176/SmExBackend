import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/Core/Base/Entity/BaseEntity';
import { Room } from 'src/Modules/Room/Entity/Room';
import { User } from 'src/Modules/User/Entity/User';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ versionKey: false, collection: 'SMEX_Transaction' })
export class Transaction extends BaseEntity {
    @Prop({ type: String, required: true, maxlength: 1024 })
    title: string;

    @Prop({ type: String, maxlength: 2048 })
    description?: string;

    @Prop({ type: Number, required: true, min: 0 })
    amount: number;

    @Prop({ ref: Room.name, type: Types.ObjectId, required: true })
    roomId: Types.ObjectId;

    @Prop({ type: Date, default: new Date(), index: '' })
    dateOfPurchase: Date;

    @Prop({ ref: User.name, type: Types.ObjectId, required: true })
    paidBy: Types.ObjectId;

    @Prop({ ref: User.name, type: Types.ObjectId, required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Date, default: null })
    settlementAt: Date;

    @Prop({ type: Types.ObjectId, default: null })
    settlementId: Types.ObjectId;

    @Prop({
        type: [
            {
                user: { ref: User.name, type: Types.ObjectId, required: true },
                ratio: { type: Number, required: true, min: 0 },
                share: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
    })
    split: {
        user: Types.ObjectId;
        ratio: number;
        share: number;
    }[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
