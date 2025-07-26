import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Manejar errores de conexión
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma conectado a la base de datos');
  })
  .catch((error) => {
    console.error('❌ Error conectando a la base de datos:', error);
  });

// Manejar desconexión limpia
process.on('beforeExit', async () => {
  await prisma.$disconnect();
}); 
