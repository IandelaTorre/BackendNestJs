import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserLogsService } from '../../modules/user-logs/user-logs.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    constructor(private readonly userLogsService: UserLogsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    this.logAction(context, method, url, now, context.switchToHttp().getResponse().statusCode);
                },
                error: (error) => {
                    const status = error.status || 500;
                    this.logAction(context, method, url, now, status);
                }
            }),
        );
    }

    private async logAction(
        context: ExecutionContext,
        method: string,
        url: string,
        startTime: number,
        status: number,
    ) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const duration = Date.now() - startTime;
        const action = `${method} ${url} [${status}] (${duration}ms)`;

        this.logger.log(action);

        if (user && user.uuid) {
            try {
                await this.userLogsService.logAction(user.uuid, action);
            } catch (err) {
                this.logger.error(`Failed to log user action: ${err.message}`, err.stack);
            }
        }
    }
}
