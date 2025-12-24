import { Injectable } from '@nestjs/common';
import { UserLogsRepository } from './user-logs.repository';

@Injectable()
export class UserLogsService {
    constructor(private readonly repository: UserLogsRepository) { }

    async logAction(userUuid: string, action: string) {
        return this.repository.createLog({
            userUuid,
            action,
        });
    }
}
