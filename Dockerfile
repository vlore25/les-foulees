# 1. Étape de Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=builder --chown=10101 /app/.next ./_next
COPY --from=builder --chown=10101 /app/public ./public
# On déclare les arguments nécessaires au build (Next.js en a besoin ici)
ARG DATABASE_URL
ARG JWT_SECRET
ARG RESEND_API_KEY

# On les transforme en variables d'environnement pour le processus 'npm run build'
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Étape d'exécution
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# On copie tout depuis le builder
COPY --from=builder /app ./

# Création du dossier pour les images (sera écrasé par le volume en runtime)
RUN mkdir -p public/uploads

EXPOSE 3000
CMD ["npm", "start"]