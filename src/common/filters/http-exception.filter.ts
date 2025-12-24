import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal Server Error';

        let errorDetails = message;
        if (typeof message === 'object' && (message as any).message) {
            errorDetails = (message as any).message;
        }

        const errorResponse = {
            type: 'about:blank',
            title: exception instanceof HttpException ? 'Http Exception' : 'Internal Server Error',
            status,
            detail: errorDetails,
            instance: request.url,
        };

        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(exception);
        }

        response.status(status).json(errorResponse);
    }
}
