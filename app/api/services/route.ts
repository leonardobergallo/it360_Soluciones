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
    
    const services = await prisma.service.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { id: 'asc' }
    });
    
    console.log(`✅ ${services.length} servicios encontrados`);
    
    await prisma.$disconnect();
    
    return NextResponse.json(services);
    
  } catch (error: any) {
    console.error('❌ Error en API de servicios:', error);
    
    // Manejo específico de errores de Prisma
    if (error.code === 'P6001') {
      return NextResponse.json(
        { 
          error: 'Error de configuración de base de datos',
          details: 'La URL de la base de datos no está configurada correctamente',
          solution: 'Verifica que DATABASE_URL esté configurado en Vercel'
        },
        { status: 500 }
      );
    }
    
    if (error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { 
          error: 'No se puede conectar a la base de datos',
          details: 'La base de datos Neon no está accesible',
          solution: 'Verifica que la base de datos esté activa y las credenciales sean correctas'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error al obtener servicios',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor',
        solution: 'Revisa los logs del servidor para más detalles'
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
