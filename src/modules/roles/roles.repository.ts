import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../config/database.config';
import type { DrizzleDB } from '../../database/types';
import { roles } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class RolesRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

    async findAll() {
        return this.db.select().from(roles).where(eq(roles.enabled, true));
    }

    async findByUuid(uuid: string) {
        const [role] = await this.db.select().from(roles).where(and(eq(roles.uuid, uuid), eq(roles.enabled, true)));
        return role;
    }
}
