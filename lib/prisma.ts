import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Función para crear una nueva instancia de PrismaClient
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });
}

// Inicializar el cliente de Prisma
export const prisma = globalForPrisma.prisma || createPrismaClient();

// En desarrollo, reutilizar la misma instancia
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Manejar desconexión limpia
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Manejar señales de terminación
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 
