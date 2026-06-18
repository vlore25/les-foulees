# Instructions & Contexte pour Gemini (Assistant IA)

Ce fichier sert de référence pour le contexte du projet `les-foulees` afin d'éviter les erreurs communes (comme utiliser npm au lieu de bun) et de garder en mémoire l'architecture.

## 📦 Environnement et Gestionnaire de Paquets
- **Gestionnaire principal :** `bun` ! (Ne jamais utiliser `npm` ou `yarn`).
- **Commandes :** 
  - `bun install` pour installer des paquets.
  - `bun run <script>` pour lancer un script défini dans `package.json`.
  - `bunx` pour exécuter des commandes CLI ponctuelles (ex: `bunx prisma generate`).

## 🛠 Stack Technique & Frameworks
- **Frontend / Backend :** Next.js 16 (App Router) avec React 19 (RC).
- **Styling :** TailwindCSS v4 et composants d'interface basés sur Radix UI / Shadcn UI.
- **Base de données :** PostgreSQL avec **Prisma ORM v7.2**.
- **Tests :** Jest et React Testing Library.

## ⚙️ Détails de Configuration
- **Prisma :** Les modèles générés ne sont pas dans `node_modules` mais dans `prisma/generated/`. L'alias `@prisma/*` pointe vers ce dossier (voir `tsconfig.json`).
- **Next.js (`next.config.ts`) :**
  - Limite de taille pour les requêtes Server Actions augmentée à `10mb`.
  - Domaines d'images autorisés : `localhost` et `82.165.134.12` (pour le dossier `/uploads/les-foulees/**`).
- **TypeScript (`tsconfig.json`) :**
  - Alias `@/*` pointe vers la racine `./*`.
  - Module resolution réglé sur `bundler`.
- **ESLint (`eslint.config.mjs`) :**
  - Utilise la nouvelle syntaxe Flat Config (ESLint 9). *Note : Il peut y avoir des erreurs de résolution de module avec `eslint-config-next/core-web-vitals` selon la façon dont ESLint le charge.*
- **Build (`package.json`) :** 
  - Le script `build` exécute la génération et la migration Prisma avec `bunx` avant de faire un `next build`.

---
*Généré par Gemini suite à l'analyse des fichiers de configuration.*
