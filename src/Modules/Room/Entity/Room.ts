import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { RoomSettings } from './RoomSettings';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ versionKey: false, collection: 'SMEX_Room' })
export class Room {
    @Prop({ type: String, required: true, maxlength: 1024 })
    name: string;

    @Prop({ type: String, default: null, maxlength: 1024 })
    description?: string;

    @Prop({ ref: 'User', type: [Types.ObjectId], default: [] })
    members: Types.ObjectId[];

    @Prop({ ref: 'User', type: Types.ObjectId, required: true })
    hostId: Types.ObjectId;

    @Prop({ type: RoomSettings, ref: 'RoomSetting', required: true })
    settings: RoomSettings;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
