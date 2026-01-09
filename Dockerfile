# 1. Base : Image Node Alpine
FROM node:22-alpine AS base
WORKDIR /app
# libc6-compat est souvent nécessaire pour Next.js/Prisma sur Alpine
RUN apk add --no-cache libc6-compat

# 2. Deps : Installation de TOUTES les dépendances (pour le build)
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
# On installe tout (dev + prod) pour que le build fonctionne
RUN npm ci

# 3. Prod-Deps : Installation UNIQUEMENT de la prod (pour l'image finale)
# C'est ici qu'on fait l'équivalent du "prune" proprement
FROM base AS prod-deps
COPY package*.json ./
COPY prisma ./prisma/
# --only=production ignore les devDependencies (Tailwind, TS, etc.)
RUN npm ci --only=production
# Important : Il faut régénérer le client Prisma pour l'environnement de prod
RUN npx prisma generate

# 4. Builder : Construction de l'application
FROM base AS builder
WORKDIR /app

ARG DATABASE_URL
ARG JWT_SECRET
ARG RESEND_API_KEY

# Les variables d'environnement sont nécessaires au BUILD pour injecter les envs publiques (NEXT_PUBLIC_)
# Note: Les secrets privés (JWT, DATABASE) ne sont techniquement pas requis au build par Next.js 
# sauf si vous faites des appels DB dans getStaticProps, mais je les laisse par sécurité.
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV RESEND_API_KEY=$RESEND_API_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Génération du client Prisma + Build Next.js
RUN npx prisma generate
RUN npm run build
# 5. Runner : L'image finale (Mode Standard)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Création de l'utilisateur pour la sécurité (bonne pratique)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# --- CHANGEMENTS MAJEURS ICI ---

# A. On copie le dossier public
COPY --from=builder /app/public ./public

# B. On copie le dossier .next COMPLET (pas juste standalone)
# On change le propriétaire pour que l'utilisateur nextjs puisse écrire dans le cache si besoin
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# C. On copie les node_modules de production (depuis l'étape prod-deps)
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# D. On copie package.json et prisma (utile pour les scripts de start)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# On passe sur l'utilisateur sécurisé
USER nextjs

EXPOSE 3000

# Commande standard de Next.js
CMD ["npm", "start"]