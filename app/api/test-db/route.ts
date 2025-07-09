import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Intentar conectar a la base de datos
    await prisma.$connect();
    
    // Hacer una consulta simple
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const serviceCount = await prisma.service.count();
    
    return NextResponse.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      data: {
        users: userCount,
        products: productCount,
        services: serviceCount,
        database: 'PostgreSQL (Neon)',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error conectando a la base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
} 