import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Probar la conexión a la base de datos
    await prisma.$connect();
    
    // Contar usuarios como prueba
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Conexión a la base de datos exitosa',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en test API:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error conectando a la base de datos',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 