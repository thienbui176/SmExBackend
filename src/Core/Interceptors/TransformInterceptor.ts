import {
    CallHandler,
    ExecutionContext,
    HttpStatus,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import ApiResponse from '../Interfaces/ApiResponse';
import { RESPONSE_MESSAGE } from '../Metadata/ResponseMessageMetadata';
import Messages from '../Messages/Messages';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                return {
                    data: data,
                    status: HttpStatus[
                        context.switchToHttp().getResponse().statusCode
                    ],
                    message:
                        this.reflector.get(
                            RESPONSE_MESSAGE,
                            context.getHandler(),
                        ) || Messages.MSG_SUCCESS_DEFAULT,
                };
            }),
        );
    }
}
