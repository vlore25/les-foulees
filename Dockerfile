# 1. Base : On part d'une image Node légère
FROM node:22-alpine AS base
WORKDIR /app
# On copie les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/  
COPY .env ./
# 2. Dépendances (Cache)
FROM base AS deps
RUN npm ci
# 3. Development (Cible pour le local)
FROM base AS dev
# On installe TOUTES les dépendances (y compris devDependencies)
RUN npm install


# On génère le client Prisma
RUN npx prisma generate
# On ne copie pas le code ici, on utilisera un volume dans compose.yaml
CMD ["npm", "run", "dev"]

# 4. Builder (Pour la Prod)
FROM base AS builder

# --- DÉPLACEZ LES LIGNES ICI (APRÈS LE FROM) ---
ARG DATABASE_URL
ARG JWT_SECRET
ARG RESEND_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV RESEND_API_KEY=$RESEND_API_KEY
# -----------------------------------------------

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 5. Production (Image finale ultra-légère)
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma


EXPOSE 3000
CMD ["node", "server.js"]
