import { pgTable, serial, varchar, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tasks } from './tasks.schema';

export const catalogTaskStatuses = pgTable('catalog_task_statuses', {
    statusId: integer('status_id').primaryKey(),
    code: varchar('code').notNull().unique(),
    name: varchar('name').notNull(),
    description: varchar('description'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at', { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3 }).defaultNow().notNull(),
});

export const catalogTaskStatusesRelations = relations(catalogTaskStatuses, ({ many }) => ({
    tasks: many(tasks),
}));
