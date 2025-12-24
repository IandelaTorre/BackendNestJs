import { pgTable, serial, varchar, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

export const roles = pgTable('catalog_user_roles', {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().unique().notNull(),
    name: varchar('name', { length: 50 }).unique().notNull(), // 'admin', 'user', 'guest'
    visualName: varchar('visual_name', { length: 100 }).notNull(),
    enabled: boolean('enabled').default(true),
    createdAt: timestamp('created_at').defaultNow(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));
