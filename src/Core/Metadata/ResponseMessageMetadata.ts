import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'RESPONSE_MESSAGE';

export const ResponseMessage = (message: string) => {
    return (
        target: object,
        key: string | symbol,
        descriptor: PropertyDescriptor,
    ) => {
        SetMetadata(RESPONSE_MESSAGE, message)(target, key, descriptor);
    };
};
