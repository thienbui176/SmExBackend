import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/Core/Base/Entity/BaseEntity';
import { Transaction } from 'src/Modules/Transaction/Entity/Transaction';
import { User } from 'src/Modules/User/Entity/User';

export type ExpenseDocument = HydratedDocument<Expense>;

@Schema({ versionKey: false, collection: 'SMEX_Expenses' })
export class Expense extends BaseEntity {
    @Prop({ type: String, required: true, maxlength: 1024 })
    title: string;

    @Prop({ type: String, maxlength: 2048 })
    description?: string;

    @Prop({ type: Number, required: true, min: 0 })
    amount: number;

    @Prop({ type: Date, default: new Date(), index: '' })
    dateOfPurchase: Date;

    @Prop({ ref: User.name, type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({ ref: Transaction.name, type: Types.ObjectId, default: null })
    rootTransaction: Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
