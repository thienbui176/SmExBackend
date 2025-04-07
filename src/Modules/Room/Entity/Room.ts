import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ versionKey: false })
export class Room {
    @Prop({ type: String, isRequired: true, maxlength: 1024 })
    name: string;

    @Prop({ type: String, default: null, maxlength: 1024 })
    description?: string;

    @Prop({ ref: 'User', type: [Types.ObjectId] })
    members: Types.ObjectId[];

    @Prop({ ref: 'User', type: Types.ObjectId })
    hostId: Types.ObjectId;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
