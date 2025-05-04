import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoomSettings } from './RoomSettings';
import { User } from 'src/Modules/User/Entity/User';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ versionKey: false, collection: 'SMEX_Room' })
export class Room {
    @Prop({ type: String, required: true, maxlength: 1024 })
    name: string;

    @Prop({ type: String, default: null, maxlength: 1024 })
    description?: string;

    @Prop({ ref: User.name, type: [Types.ObjectId], default: [] })
    members: Types.ObjectId[];

    @Prop({ ref: User.name, type: Types.ObjectId, required: true })
    host: Types.ObjectId;

    @Prop({ type: Date, default: new Date() })
    finalSettlementDate: Date;

    @Prop({
        type: RoomSettings,
        ref: RoomSettings.name,
        default: {
            categoriesOfExpense: [],
            notifyExpenseNotes: true,
            createdSettlementNotifications: true,
            weeklySummaryNotifications: true,
            telegramId: null,
        },
    })
    settings: RoomSettings;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
