import { pgTable, serial, varchar, boolean, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { roles } from './roles.schema';
import { userLogs } from './user-logs.schema';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    secondLastName: varchar('second_last_name', { length: 100 }),
    userCode: varchar('user_code', { length: 50 }).unique().notNull(),
    roleId: integer('role_id').references(() => roles.id).notNull(),
    enabled: boolean('enabled').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
    logs: many(userLogs),
}));
