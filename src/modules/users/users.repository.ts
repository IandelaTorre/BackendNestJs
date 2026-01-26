import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../config/database.config';
import type { DrizzleDB } from '../../database/types';
import { users, roles } from '../../database/schema';
import { eq, and, sql } from 'drizzle-orm';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
// @ts-ignore
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

    async create(data: CreateUserDto & { userCode: string; passwordHash: string }) {
        return this.db.insert(users).values({
            email: data.email,
            password: data.passwordHash,
            name: data.name,
            lastName: data.lastName,
            secondLastName: data.secondLastName,
            roleId: data.roleId,
            userCode: data.userCode,
            enabled: true,
        }).returning();
    }

    async findAll() {
        const result = await this.db.select()
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(eq(users.enabled, true));

        return result.map(({ users, catalog_user_roles }) => ({
            ...users,
            role: catalog_user_roles
        }));
    }

    async findByUuid(uuid: string) {
        const result = await this.db.select()
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(and(eq(users.uuid, uuid), eq(users.enabled, true)));

        if (result.length === 0) return null;

        const { users: u, catalog_user_roles: r } = result[0];
        return { ...u, role: r };
    }

    async findByEmail(email: string) {
        const result = await this.db.select()
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(and(eq(users.email, email), eq(users.enabled, true)));

        if (result.length === 0) return null;

        const { users: u, catalog_user_roles: r } = result[0];
        return { ...u, role: r };
    }

    async findByUserCode(userCode: string) {
        // Case insensitive search
        const result = await this.db.select()
            .from(users)
            .leftJoin(roles, eq(users.roleId, roles.id))
            .where(and(sql`lower(${users.userCode}) = lower(${userCode})`, eq(users.enabled, true)));

        if (result.length === 0) return null;

        const { users: u, catalog_user_roles: r } = result[0];
        return { ...u, role: r };
    }

    async update(uuid: string, data: UpdateUserDto) {
        return this.db.update(users)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(users.uuid, uuid))
            .returning();
    }

    async softDelete(uuid: string) {
        return this.db.update(users)
            .set({ enabled: false, updatedAt: new Date() })
            .where(eq(users.uuid, uuid));
    }

    async updatePassword(uuid: string, passwordHash: string) {
        return this.db.update(users)
            .set({ password: passwordHash, updatedAt: new Date() })
            .where(eq(users.uuid, uuid));
    }
}
