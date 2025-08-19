import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Inicializar el cliente de Prisma
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// En desarrollo, reutilizar la misma instancia
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 
