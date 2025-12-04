import { PrismaClient } from '@prisma/client';

// Instance unique de Prisma Client pour éviter les connexions multiples
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
