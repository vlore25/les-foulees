import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: "prisma/schema.prisma",
  
  // Tes paramètres de migrations et seed que j'avais zappés
  migrations: {
    path: "prisma/migrations",
    seed: "bunx tsx prisma/seed.ts" 
  },
  
  datasource: {
    url: env("POSTGRES_DATABASE_URL"),
  },
});