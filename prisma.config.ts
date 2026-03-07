import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv'; 

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";

dotenv.config({ path: envFile });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts" 
  },
  datasource: {
    url: process.env.DATABASE_URL
  },
});