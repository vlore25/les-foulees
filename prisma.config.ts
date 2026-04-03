import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// On force le chemin absolu vers le fichier .env à la racine
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export default defineConfig({
  schema: "prisma/schema.prisma",
  
  // Tes paramètres de migrations et seed que j'avais zappés
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts" 
  },
  
  datasource: {
    // On s'assure que l'URL n'est pas "undefined"
    url: process.env.DATABASE_URL
  },
});