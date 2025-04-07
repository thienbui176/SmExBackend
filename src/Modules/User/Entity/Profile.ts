import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GENDER } from 'src/Constants/Gender';

export type RoomDocument = HydratedDocument<Profile>;

@Schema({ versionKey: false })
export class Profile {
    @Prop({ required: true, maxlength: 122 })
    fullName: string;

    @Prop({ enum: GENDER, default: GENDER.OTHER })
    gender?: GENDER;

    @Prop({ minlength: 10, maxlength: 11 })
    phoneNumber?: string;

    @Prop({ default: null })
    dateOfBirth?: Date;

    @Prop({ default: null, maxlength: 522 })
    address?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
