## Scripts

### `dev`

Starts the development server using Next.js. This script enables hot-reloading and provides a development environment for building and testing your application.

### `start`

Starts the development server using Next.js. This script enables hot-reloading and provides a development environment for building and testing your application.

### `build`

Runs a sequence of commands to prepare the application for production:

1. prisma generate: Generates Prisma client code based on your Prisma schema.
2. prisma migrate deploy: Applies pending migrations to the database.
3. next build: Builds the Next.js application for production.

### `db:generate`

Generates Prisma client code based on your Prisma schema. This is typically used when you make changes to your schema and need to update the client code.

### `db:seed`

Runs the database seeding script located at server/db/seed.ts. This script populates the database with initial data required for the application.

### `db:studio`

Opens Prisma Studio, a GUI for interacting with your database. This allows you to view and manage your data through an interactive interface.

### `db:migrate-dev`

Runs a sequence of commands for development database management:

1. prisma migrate dev: Applies any pending migrations and updates the database schema in development.
2. prisma generate: Generates Prisma client code based on the updated schema.

## Techstack

- NextJS 14 (App Router)
- TypeScript
- React 18
- PostgreSQL (Vercel)
- Prisma
- tRPC
- Tailwind CSS (no other libraries)
- Radix UI (Shadcn-ui components collection build on top of Radix UI and Tailwindcss)
- React Hook Form and Zod
- useQuery
- Deployment on Vercel

## Additional UX

- [x] Loading bar to indicate background Fetching of RQ
- [x] Optimistic update when user click to notification.
