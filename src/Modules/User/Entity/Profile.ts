import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type RoomDocument = HydratedDocument<Profile>;

@Schema()
export class Profile {
    @Prop()
    fullName?: string

    @Prop()
    gender?: string

    @Prop()
    phoneNumber?: string

    @Prop()
    dateOfBirth?: Date

    @Prop()
    address?: string
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);