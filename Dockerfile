# 1. Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# 2. Run stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# On copie tout le dossier buildé et les modules
COPY --from=builder /app ./

# On s'assure que le dossier des images existe
RUN mkdir -p public/uploads

EXPOSE 3000
CMD ["npm", "start"]