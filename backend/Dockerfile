FROM node:24-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy Prisma files
COPY prisma ./prisma
RUN npx prisma@6 generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Create logs directory
RUN mkdir -p logs && chmod 777 logs

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]