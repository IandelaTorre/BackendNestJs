import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
// @ts-ignore
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

dotenv.config();

const main = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });

    const db = drizzle(pool, { schema });

    console.log('Seeding database...');

    // Roles
    const rolesData = [
        { name: 'admin', visualName: 'Administrador' },
        { name: 'user', visualName: 'Usuario' },
        { name: 'guest', visualName: 'Invitado' },
    ];

    for (const role of rolesData) {
        await db.insert(schema.roles)
            .values(role)
            .onConflictDoUpdate({
                target: schema.roles.name,
                set: { visualName: role.visualName },
            });
    }
    console.log('Roles seeded.');

    // Admin User
    const [adminRole] = await db.select().from(schema.roles).where(eq(schema.roles.name, 'admin'));

    if (!adminRole) throw new Error('Admin role not found');

    const adminPassword = await bcrypt.hash('admin123', 10);

    await db.insert(schema.users)
        .values({
            email: 'admin@example.com',
            password: adminPassword,
            name: 'Admin',
            lastName: 'System',
            userCode: 'ADM-XXXXX',
            roleId: adminRole.id,
        })
        .onConflictDoNothing({ target: schema.users.email });

    console.log('Admin user seeded.');

    await pool.end();
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
