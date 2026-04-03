import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// On force le chemin absolu vers le fichier .env à la racine
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL // Maintenant, il devrait trouver la variable
  },
});