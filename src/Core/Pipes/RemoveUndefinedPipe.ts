import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class RemoveUndefinedPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        return Object.fromEntries(Object.entries(value).filter(([_, v]) => v !== undefined));
    }
}
