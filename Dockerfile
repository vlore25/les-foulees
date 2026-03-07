# 1. Base
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# 2. DEPS : C'est ici que TypeScript arrive !
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./prisma.config.ts

# "npm ci" installe TOUT (dependencies + devDependencies)
# DONC : TypeScript est installé ici dans ./node_modules
RUN npm ci

# 3. BUILDER : C'est ici qu'on UTILISE TypeScript
FROM base AS builder
WORKDIR /app

# On copie les modules (qui contiennent TypeScript) depuis l'étape deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# CORRECTION CRITIQUE : On donne une fausse URL pour que Prisma ne plante pas
# Prisma a besoin de cette variable pour générer le client, même sans connexion réelle.
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Désactive la télémétrie Next.js pour accélérer le build
ENV NEXT_TELEMETRY_DISABLED 1

# Génération du client Prisma (utilise les définitions TS)
RUN npx prisma generate

# Compilation du projet (Next.js utilise TypeScript pour créer le JS optimisé)
RUN npm run build

# 4. PROD-DEPS : On prépare les modules SANS TypeScript pour la fin
FROM base AS prod-deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# --only=production : On n'installe PAS TypeScript ici, juste le nécessaire pour tourner
RUN npm ci --only=production
RUN npx prisma generate

# 5. RUNNER : L'image finale (Sans TypeScript, juste du JS)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# On copie le code compilé (JS) depuis le builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# On copie les modules LÉGERS (sans TypeScript) depuis prod-deps
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Fichiers de config
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]