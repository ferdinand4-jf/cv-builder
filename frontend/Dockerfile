FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Correction ici pour ignorer le conflit de peer dependencies
RUN npm ci --legacy-peer-deps

COPY . .

# Sécurité : Crée le dossier public s'il n'existe pas pour éviter le crash au moment du COPY final
RUN mkdir -p public

RUN sed -i '/ignoreDeprecations/d' tsconfig.json && npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]