FROM node:24-alpine

WORKDIR /app

# 1. Installer les dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 2. Copier le reste du code source (Nécessaire avant le build !)
COPY . .

# 3. Nettoyer, générer le client Prisma et compiler
RUN npm run clean && npx prisma generate && sed -i '/ignoreDeprecations/d' tsconfig.json && npx tsc

# 4. Préparer les répertoires nécessaires
RUN mkdir -p uploads && chmod 777 uploads
RUN mkdir -p logs && chmod 777 logs

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]