import type { Prisma } from '@prisma/client';

declare const process: {
  env: Record<string, string | undefined>;
};

export default {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || '',
    },
  },
} satisfies Prisma.PrismaClientOptions;