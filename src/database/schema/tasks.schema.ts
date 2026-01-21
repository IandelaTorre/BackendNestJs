import { pgTable, serial, text, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { catalogTaskStatuses } from './catalog-task-statuses.schema';

export const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    statusId: integer('status_id').notNull().references(() => catalogTaskStatuses.statusId),
    assignedBy: uuid('assigned_by').references(() => users.uuid),
    assignedAt: timestamp('assigned_at', { precision: 3 }).defaultNow().notNull(),
    assignedTo: uuid('assigned_to').notNull().references(() => users.uuid),
    createdAt: timestamp('created_at', { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { precision: 3 }).defaultNow().notNull(),
    isActive: boolean('is_active').default(true),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
    status: one(catalogTaskStatuses, {
        fields: [tasks.statusId],
        references: [catalogTaskStatuses.statusId],
    }),
    assignedByUser: one(users, {
        fields: [tasks.assignedBy],
        references: [users.uuid],
        relationName: 'assignedByRelation'
    }),
    assignedToUser: one(users, {
        fields: [tasks.assignedTo],
        references: [users.uuid],
        relationName: 'assignedToRelation'
    }),
}));
