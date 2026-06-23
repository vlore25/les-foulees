# Instructions et Contexte pour l'Assistant IA (Projet : Les Foulées Avrillaises)

Bonjour. Tu es un développeur expert en Next.js, TypeScript, et Prisma. 
Ce fichier te donne tout le contexte nécessaire pour travailler efficacement sur le projet "Les Foulées Avrillaises". Avant d'exécuter une tâche, de lire des fichiers au hasard ou de proposer du code, lis attentivement ces directives.

## 1. Vue d'ensemble du Projet
Il s'agit d'une application web full-stack de gestion pour un club de course à pied. L'application possède plusieurs zones distinctes :
- **Espace Public** (`/app/(external)`) : Vitrine du site (Accueil, Événements, Contact, Mentions légales).
- **Espace Auth** (`/app/(auth)`) : Connexion, Inscription, Récupération de mot de passe.
- **Espace Membre** (`/app/(main)`) : Zone sécurisée pour les adhérents (Annuaire, Documents, Événements internes, Profil).
- **Espace Admin** (`/app/(admin)`) : Tableau de bord de gestion (Utilisateurs, Adhésions, Paiements, Événements, Configuration du site).

## 2. Stack Technique Principale
- **Framework :** Next.js (App Router uniquement)
- **Langage :** TypeScript (mode strict exigé)
- **Base de données / ORM :** Prisma + PostgreSQL
- **Styling :** Tailwind CSS + shadcn/ui
- **Architecture :** Feature-Sliced Design (Logique métier groupée par "features")

## 3. Architecture du Code (Où chercher quoi)
Pour éviter de faire des `ListDir` inutiles, voici l'arborescence stricte du projet :

- `/app` : Contient **uniquement** le routing (fichiers `page.tsx`, `layout.tsx`, `loading.tsx`). Le code métier ne doit PAS se trouver ici. Les dossiers sont groupés par `(route-groups)`.
- `/src/features/[nom-de-la-feature]` : **C'est le cœur de l'application.** Chaque fonctionnalité (auth, users, events, membership, docs...) a son propre dossier contenant :
  - `[feature].actions.ts/tsx` : Les Server Actions pour les mutations.
  - `dal.ts/tsx` : Data Access Layer (requêtes Prisma pour la lecture de données).
  - `/components` : Composants UI spécifiques à cette feature (ex: `EventForm`, `UserList`).
- `/components` : Composants partagés globaux.
  - `/ui` : Composants génériques (shadcn).
  - `/layout` : Header, Footer, Sidebar.
  - `/common` : Composants transverses (ex: `ErrorBox`, logos).
- `/lib` : Utilitaires, définitions de types (DTOs), configuration de la base de données, gestion de session.

## 4. Règles de Développement Strictes
Quand tu dois écrire ou modifier du code, respecte toujours ces règles :

1. **Séparation des préoccupations (Server / Client) :**
   - Par défaut, utilise des **Server Components**.
   - Ajoute `'use client'` *uniquement* si tu as besoin de state (`useState`), d'effets (`useEffect`), ou d'interactivité utilisateur (onClick, onChange).
   - Les appels à la base de données se font **exclusivement** dans les Server Components via le fichier `dal.ts` de la feature, ou via des Server Actions pour les modifications.

2. **Server Actions :**
   - Place les Server Actions dans les fichiers `[feature].actions.ts`.
   - Elles doivent toujours valider les données en entrée (avec Zod si possible) et gérer les erreurs gracieusement (try/catch) avant de retourner un résultat formatté au client.

3. **Data Access Layer (DAL) :**
   - Ne fais jamais de requêtes `prisma.model.findMany()` directement dans un composant UI. Utilise toujours une fonction exportée depuis `src/features/[nom]/dal.ts`.

4. **Style et UI :**
   - Utilise Tailwind CSS. 
   - Réutilise au maximum les composants existants dans `components/ui` (boutons, inputs, dialogues) plutôt que de créer des éléments HTML natifs avec plein de classes.

## 5. Instructions pour la Résolution de Problèmes et les Tests
- **Recherche de bugs :** Cherche d'abord dans les composants de la `feature` concernée, puis remonte vers les `actions` ou le `dal`, et enfin vérifie le schéma Prisma si le problème concerne la donnée.
- **Tester en ligne de commande :** Si l'utilisateur demande de tester une fonctionnalité (ex: mot de passe), crée un script TypeScript dans `/scripts`, importe les fonctions nécessaires, et exécute-le avec `bun run scripts/ton_script.ts`. N'essaie pas d'utiliser un navigateur.
- **Variables d'environnement :** Si le comportement dépend de l'environnement, lis toujours le fichier `.env` à la racine pour comprendre la configuration locale.

## 6. Base de Données (Prisma)
- Le fichier source de vérité est `prisma/schema.prisma`. 
- Modèles principaux : `User`, `Event`, `EventRegistration`, `Membership`, `PasswordResetToken`, `Payment`.
- Ne propose **jamais** de commande `prisma db push` ou `prisma migrate dev` sans demander l'autorisation explicite de l'utilisateur.

## 7. Déploiement et Contraintes de Production (Vercel)
- **Hébergement :** L'application est déployée sur **Vercel**.
- **Environnement Serverless :** Le code s'exécute dans des Serverless Functions. Par conséquent :
  - Ne propose **jamais** de code qui écrit des fichiers localement sur le disque en production (le système de fichiers de Vercel est en lecture seule, à l'exception de `/tmp`).
  - Toute génération de fichiers (PDF, images, etc.) doit être faite en mémoire (Buffer) ou stockée sur un service cloud tiers (S3, AWS, etc.).
- **Base de données et Prisma :** Étant donné l'environnement Serverless de Vercel, les connexions à la base de données PostgreSQL doivent être gérées avec précaution pour éviter d'épuiser le pool de connexions (utilisation recommandée de l'Edge compatible ou de PGBouncer si nécessaire).
- **Variables d'environnement :** En production, elles sont gérées directement via le tableau de bord Vercel. Les dépendances aux variables d'environnement dans le code doivent être robustes.

---
**Pour chaque nouvelle demande, commence par confirmer brièvement (en 1 phrase) que tu as compris la cible dans cette architecture, puis exécute tes outils.**