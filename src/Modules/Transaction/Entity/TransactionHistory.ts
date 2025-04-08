import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TransactionHistoryDocument = HydratedDocument<TransactionHistory>;
export enum TRANSACTION_HISTORY_ACTION {
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREATE = 'CREATE',
}

@Schema({ versionKey: false, collection: 'SMEX_TransactionHistory' })
export default class TransactionHistory {
    @Prop({ required: true, type: Types.ObjectId })
    transactionId: Types.ObjectId;

    @Prop({ enum: TRANSACTION_HISTORY_ACTION, required: true })
    action: TRANSACTION_HISTORY_ACTION;

    @Prop({ required: true, type: Types.ObjectId })
    changedBy: Types.ObjectId;

    @Prop({ type: String, default: null })
    oldValue: string;

    @Prop({ type: String, default: null })
    newValue: string;

    @Prop({ type: Date, default: new Date() })
    changedAt: Date;
}

export const TransactionHistorySchema = SchemaFactory.createForClass(TransactionHistory);
