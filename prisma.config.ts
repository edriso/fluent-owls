// Prisma CLI config (Prisma 7). The datasource block in schema.prisma no longer
// holds the URL, so the CLI (generate, migrate, db push, studio) reads it from
// here. `prisma generate` (run by postinstall in CI and Docker) never connects,
// so a missing DATABASE_URL is tolerated. Commands that DO connect (migrate
// deploy, db push) run inside the container, where the compose env_file has
// already put DATABASE_URL into the environment.
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
