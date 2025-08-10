import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Importar Prisma dinámicamente para evitar problemas de inicialización
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión simple
    const count = await prisma.service.count();
    console.log(`✅ Conexión exitosa - ${count} servicios encontrados`);
    
    // Obtener servicios
    const services = await prisma.service.findMany({
      take: 5, // Solo los primeros 5 para la prueba
      orderBy: { id: 'asc' }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: true,
      count: count,
      services: services,
      message: 'API de servicios funcionando correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error en API de servicios:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al obtener servicios',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
