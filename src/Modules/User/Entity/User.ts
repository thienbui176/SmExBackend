import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Profile } from './Profile';
import { BaseEntity } from 'src/Core/Base/Entity/BaseEntity';

export type RoomDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseEntity {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ minlength: 6, maxlength: 64, required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile', default: null })
  profile?: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
