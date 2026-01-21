import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../config/database.config';
import type { DrizzleDB } from '../../database/types';
import { tasks, catalogTaskStatuses, users } from '../../database/schema';
import { eq, and, desc, aliasedTable } from 'drizzle-orm';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Injectable()
export class TasksRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

    private getIncludes(includeParams: string[]) {
        // Return flags for what to include
        return {
            status: includeParams.includes('status'),
            assignedBy: includeParams.includes('assignedBy'),
            assignedTo: includeParams.includes('assignedTo'),
        };
    }

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
            query = query.leftJoin(assignedByUsers, eq(tasks.assignedBy, assignedByUsers.uuid)) as any;
        }
        if (include.includes('assignedTo')) {
            query = query.leftJoin(assignedToUsers, eq(tasks.assignedTo, assignedToUsers.uuid)) as any;
        }

        query = query.orderBy(desc(tasks.createdAt)) as any;

        const results = await query;

        return results.map(row => {
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
        });
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
            query = query.leftJoin(assignedByUsers, eq(tasks.assignedBy, assignedByUsers.uuid)) as any;
        }
        if (include.includes('assignedTo')) {
            query = query.leftJoin(assignedToUsers, eq(tasks.assignedTo, assignedToUsers.uuid)) as any;
        }

        const results = await query;
        if (results.length === 0) return null;

        const row = results[0];
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

    async create(data: Omit<CreateTaskDto, 'assignedBy'> & { assignedBy: string | null }) {
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
}
