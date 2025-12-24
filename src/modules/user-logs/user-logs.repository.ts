import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../config/database.config';
import type { DrizzleDB } from '../../database/types'; // Need to define types
import { userLogs } from '../../database/schema';

@Injectable()
export class UserLogsRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

    async createLog(data: typeof userLogs.$inferInsert) {
        return this.db.insert(userLogs).values(data).returning();
    }
}
