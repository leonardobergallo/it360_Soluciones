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

// Función para conectar explícitamente
export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma Client conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando Prisma Client:', error);
    throw error;
  }
}

// Función para desconectar
export async function disconnectPrisma() {
  try {
    await prisma.$disconnect();
    console.log('✅ Prisma Client desconectado');
  } catch (error) {
    console.error('❌ Error desconectando Prisma Client:', error);
  }
} 
