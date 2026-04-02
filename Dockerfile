FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Variables nécessaires pour ne pas faire planter le build (ex: Resend)
ARG DATABASE_URL
ARG JWT_SECRET
ARG RESEND_API_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV RESEND_API_KEY=$RESEND_API_KEY

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# En mode standalone, on copie ces 3 choses précises :
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Création du dossier d'upload pour le volume
RUN mkdir -p public/uploads/users public/uploads/events

EXPOSE 3000
# On lance le serveur standalone (plus rapide et léger)
CMD ["node", "server.js"]