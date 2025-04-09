import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import ApiResponse from '../Interfaces/ApiResponse';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        let errorResponse: ApiResponse<any> = {
            message:
                status === HttpStatus.INTERNAL_SERVER_ERROR
                    ? 'Internal Server Error'
                    : exception.message,
            status: HttpStatus[status],
            data: null,
        };
        if (status === HttpStatus.BAD_REQUEST) {
            const validationErrors = exception.getResponse() as any;
            if (typeof validationErrors === 'object' && validationErrors?.type === 'VALIDATION') {
                const { type, ...rest } = validationErrors;
                errorResponse = {
                    ...errorResponse,
                    message: 'Validation failed',
                    errors: rest,
                };
            }
            if (validationErrors) {
                errorResponse = {
                    ...errorResponse,
                };
            }
        }

        response.status(status).json(errorResponse);
    }
}
