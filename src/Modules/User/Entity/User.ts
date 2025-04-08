import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './Profile';
import { BaseEntity } from 'src/Core/Base/Entity/BaseEntity';

export type RoomDocument = HydratedDocument<User>;

export enum USER_STATUS {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

@Schema({ versionKey: false, collection: 'SMEX_User' })
export class User extends BaseEntity {
    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ minlength: 6, maxlength: 522, required: true })
    password: string;

    @Prop({ enum: USER_STATUS, default: USER_STATUS.ACTIVE })
    status: USER_STATUS;

    @Prop({
        type: Profile,
        ref: 'Profile',
        default: null,
    })
    profile?: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
