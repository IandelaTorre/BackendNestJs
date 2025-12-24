import { pgTable, serial, timestamp, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

export const userLogs = pgTable('user_logs', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().unique().notNull(),
    userUuid: uuid('user_uuid').references(() => users.uuid).notNull(),
    action: text('action').notNull(), // METHOD /path [STATUS] (Xms)
    createdAt: timestamp('created_at').defaultNow(),
});

export const userLogsRelations = relations(userLogs, ({ one }) => ({
    user: one(users, {
        fields: [userLogs.userUuid],
        references: [users.uuid], // Correctly referencing uuid not id as per schema
    }),
}));
