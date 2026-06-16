import { defineConfig, env } from '@prisma/config';
import 'dotenv/config'

export default defineConfig({
  schema: "prisma/schema.prisma",
  
  // Tes paramètres de migrations et seed que j'avais zappés
  migrations: {
    path: "prisma/migrations",
    seed: "bunx tsx prisma/seed.ts" 
  },
  
  datasource: {
    url: env("DATABASE_URL"),
  },
});