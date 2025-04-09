import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isMongoId } from 'class-validator';
import Messages from '../Messages/Messages';

@Injectable()
export class IsMongoIdParam implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!isMongoId(value)) {
            throw new BadRequestException(Messages.IS_NOT_MONGO_ID);
        }
        return value;
    }
}
