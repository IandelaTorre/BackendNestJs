import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../config/database.config';
import type { DrizzleDB } from '../../database/types';
import { tasks, catalogTaskStatuses, users } from '../../database/schema';
import { eq, and, desc, aliasedTable } from 'drizzle-orm';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Injectable()
export class TasksRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

    async findAll(include: string[] = []) {
        const assignedByUsers = aliasedTable(users, 'assigned_by_users');
        const assignedToUsers = aliasedTable(users, 'assigned_to_users');

        let query = this.db.select({
            task: tasks,
            ...(include.includes('status') ? { status: catalogTaskStatuses } : {}),
            ...(include.includes('assignedBy') ? { assignedBy: assignedByUsers } : {}),
            ...(include.includes('assignedTo') ? { assignedTo: assignedToUsers } : {}),
        })
            .from(tasks)
            .where(eq(tasks.isActive, true));

        if (include.includes('status')) {
            query = query.leftJoin(catalogTaskStatuses, eq(tasks.statusId, catalogTaskStatuses.statusId)) as any;
        }
        if (include.includes('assignedBy')) {
            query = query.leftJoin(assignedByUsers, eq(tasks.assignedByCode, assignedByUsers.userCode)) as any;
        }
        if (include.includes('assignedTo')) {
            query = query.leftJoin(assignedToUsers, eq(tasks.assignedToCode, assignedToUsers.userCode)) as any;
        }

        query = query.orderBy(desc(tasks.createdAt)) as any;

        const results = await query;

        return results.map(row => this.mapRowToResult(row));
    }

    async findById(id: number, include: string[] = []) {
        const assignedByUsers = aliasedTable(users, 'assigned_by_users');
        const assignedToUsers = aliasedTable(users, 'assigned_to_users');

        let query = this.db.select({
            task: tasks,
            ...(include.includes('status') ? { status: catalogTaskStatuses } : {}),
            ...(include.includes('assignedBy') ? { assignedBy: assignedByUsers } : {}),
            ...(include.includes('assignedTo') ? { assignedTo: assignedToUsers } : {}),
        })
            .from(tasks)
            .where(and(eq(tasks.id, id), eq(tasks.isActive, true)));

        if (include.includes('status')) {
            query = query.leftJoin(catalogTaskStatuses, eq(tasks.statusId, catalogTaskStatuses.statusId)) as any;
        }
        if (include.includes('assignedBy')) {
            query = query.leftJoin(assignedByUsers, eq(tasks.assignedByCode, assignedByUsers.userCode)) as any;
        }
        if (include.includes('assignedTo')) {
            query = query.leftJoin(assignedToUsers, eq(tasks.assignedToCode, assignedToUsers.userCode)) as any;
        }

        const results = await query;
        if (results.length === 0) return null;

        return this.mapRowToResult(results[0]);
    }

    async findByUserUuid(uuid: string, include: string[] = []) {
        const assignedByUsers = aliasedTable(users, 'assigned_by_users');
        const assignedToUsers = aliasedTable(users, 'assigned_to_users');

        let query = this.db.select({
            task: tasks,
            ...(include.includes('status') ? { status: catalogTaskStatuses } : {}),
            ...(include.includes('assignedBy') ? { assignedBy: assignedByUsers } : {}),
            ...(include.includes('assignedTo') ? { assignedTo: assignedToUsers } : {}),
        })
            .from(tasks)
            .innerJoin(assignedToUsers, eq(tasks.assignedToCode, assignedToUsers.userCode)) // Explicit join for filter
            .where(and(eq(assignedToUsers.uuid, uuid), eq(tasks.isActive, true)));

        if (include.includes('status')) {
            query = query.leftJoin(catalogTaskStatuses, eq(tasks.statusId, catalogTaskStatuses.statusId)) as any;
        }
        if (include.includes('assignedBy')) {
            query = query.leftJoin(assignedByUsers, eq(tasks.assignedByCode, assignedByUsers.userCode)) as any;
        }
        // Note: assignedTo is already joined (as inner join), but if we want to alias it as 'assignedTo' in selection object AND support optional leftJoin semantics if requested separately...
        // Actually, for query building simplicity here, if 'assignedTo' is requested in include, we can rely on the fact that we filtering by it, so it must exist.
        // However, the `select` above uses `assignedToUsers`.
        // If we didn't include it in `select`, we wouldn't get the user object.
        // The join for filtering is necessary.
        // If `include` doesn't contain 'assignedTo', we just don't select it. The join is there for filtering.

        query = query.orderBy(desc(tasks.createdAt)) as any;

        const results = await query;
        return results.map(row => this.mapRowToResult(row));
    }

    async create(data: Omit<CreateTaskDto, 'assignedByCode' | 'assignedToCode'> & { assignedByCode: string | null, assignedToCode: string }) {
        return this.db.insert(tasks).values({
            ...data,
        }).returning();
    }

    async update(id: number, data: UpdateTaskDto) {
        return this.db.update(tasks)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(tasks.id, id))
            .returning();
    }

    async softDelete(id: number) {
        return this.db.update(tasks)
            .set({ isActive: false, updatedAt: new Date() })
            .where(eq(tasks.id, id));
    }

    private mapRowToResult(row: any) {
        const result: any = { ...row.task };
        if (row.status) result.status = row.status;
        if (row.assignedBy) {
            const { password, ...assignedBySafe } = row.assignedBy as any;
            result.assignedBy = assignedBySafe;
        }
        if (row.assignedTo) {
            const { password, ...assignedToSafe } = row.assignedTo as any;
            result.assignedTo = assignedToSafe;
        }
        return result;
    }
}
