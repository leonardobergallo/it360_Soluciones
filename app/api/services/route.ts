import { NextRequest, NextResponse } from 'next/server';

// GET - Obtener todos los servicios
export async function GET(request: NextRequest) {
  try {
    // Verificar variables de entorno críticas
    const requiredEnvVars = {
      DATABASE_URL: process.env.DATABASE_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
    };
    
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
    
    if (missingVars.length > 0) {
      console.error('❌ Variables de entorno faltantes:', missingVars);
      return NextResponse.json(
        { 
          error: 'Configuración incompleta',
          details: `Variables de entorno faltantes: ${missingVars.join(', ')}`,
          solution: 'Configura las variables de entorno en Vercel Dashboard > Settings > Environment Variables'
        },
        { status: 500 }
      );
    }
    
    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';
    
    console.log('🔍 Obteniendo servicios...');
    
    // Intentar conectar a la base de datos con timeout
    const services = await Promise.race([
      prisma.service.findMany({
        where: activeOnly ? { active: true } : {},
        orderBy: { id: 'asc' }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de conexión a la base de datos')), 10000)
      )
    ]) as any[];
    
    console.log(`✅ ${services.length} servicios encontrados`);
    
    await prisma.$disconnect();
    
    // Asegurar que siempre devolvemos un array
    return NextResponse.json(Array.isArray(services) ? services : []);
    
  } catch (error: any) {
    console.error('❌ Error en API de servicios:', error);
    
    // En caso de error, devolver un array vacío para evitar que data.map falle
    // Esto permite que la aplicación funcione aunque la base de datos no esté disponible
    console.log('⚠️ Devolviendo array vacío debido a error de conexión');
    
    // Log del error para debugging
    if (error.code === 'P6001') {
      console.error('Error de configuración de base de datos:', error.message);
    } else if (error.message?.includes('Can\'t reach database server')) {
      console.error('No se puede conectar a la base de datos Neon:', error.message);
    } else {
      console.error('Error general:', error.message);
    }
    
    // Siempre devolver un array vacío para mantener la funcionalidad de la UI
    return NextResponse.json([]);
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
