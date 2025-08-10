import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener todos los servicios
export async function GET(request: NextRequest) {
  try {
    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    console.log('🔍 Obteniendo servicios...');
    
    const services = await prisma.service.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { id: 'asc' }
    });
    
    console.log(`✅ ${services.length} servicios encontrados`);
    
    await prisma.$disconnect();
    
    return NextResponse.json(services);
    
  } catch (error) {
    console.error('❌ Error en API de servicios:', error);
    return NextResponse.json(
      { 
        error: 'Error al obtener servicios',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const body = await request.json();
    const { name, description, price, active = true } = body;

    if (!name || !description || price === undefined) {
      await prisma.$disconnect();
      return NextResponse.json(
        { error: 'Name, description y price son requeridos' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        active: active,
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(service, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creando servicio:', error);
    return NextResponse.json(
      { 
        error: 'Error al crear servicio',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
