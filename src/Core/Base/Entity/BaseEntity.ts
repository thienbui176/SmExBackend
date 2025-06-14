import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseEntity {
    _id: Types.ObjectId;

    @Prop({ type: Date, default: Date.now })
    createdAt?: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt?: Date;

    @Prop({ type: Date, default: null })
    deletedAt?: Date | null;
}
