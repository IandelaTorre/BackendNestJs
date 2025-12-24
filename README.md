# BasicAPI (NestJS · Drizzle · Neon · Zod)

BasicAPI is a production-ready NestJS backend template designed as a clean, scalable foundation for modern applications. It features role-based authentication, user management, and action logging.

## Tech Stack 🚀
- **Language**: TypeScript
- **Framework**: NestJS v10+
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Validation**: Zod (Pipes & DTOs)
- **Auth**: JWT + bcrypt
- **Docs**: Swagger/OpenAPI

## Features (MVP) 🧩
- **Auth**: Login, Signup, Password Recovery.
- **Users**: CRUD with Soft Delete.
- **Roles**: Seeded roles (admin, user, guest).
- **Logging**: Global interceptor logging actions to `user_logs`.
- **Error Handling**: RFC 7807 compliant global exception filter.

## Project Structure 🗂
```
src/
├── common/             # Global pipes, filters, interceptors
├── config/             # Environment and Database config
├── database/           # Schemas, Migrations, Seed
├── modules/            # Feature modules (Auth, Users, Roles, Logs)
└── utils/              # Shared utilities
```

## Getting Started 🛠️

### Prerequisites
- Node.js LTS
- npm or pnpm
- PostgreSQL (Neon Database recommended)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your database credentials and JWT secret.
   ```bash
   cp .env.example .env
   ```

### Database Setup
Run the following commands to initialize your database:
```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed database (Roles + Admin)
npm run db:seed
```

### Running the App
```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## API Documentation 📚
Swagger docs are available at `/api/docs`.
- URL: `http://localhost:3000/api/docs`

## Deployment 🛰️
Ready for deployment on platforms like Render.
1. Set Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`, etc.).
2. Build Command: `npm install && npm run build`
3. Start Command: `npm run start:prod`

## Author ✒️
Ian Axel de la Torre — IandelaTorre

---
⌨️ con ❤️ por IandelaTorre 😊
