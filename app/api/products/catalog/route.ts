import { NextResponse } from 'next/server';

// GET - Obtener solo productos activos para el catálogo público
export async function GET() {
  try {
    console.log('🔍 Obteniendo productos activos para catálogo...');
    
    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Obtener SOLO productos activos
    const products = await Promise.race([
      prisma.product.findMany({
        where: { 
          active: true // Solo productos activos
        },
        orderBy: {
          name: 'asc'
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de conexión a la base de datos')), 10000)
      )
    ]) as any[];
    
    console.log(`✅ ${products.length} productos activos encontrados para catálogo`);
    
    await prisma.$disconnect();
    
    // Asegurar que siempre devolvemos un array
    return NextResponse.json(Array.isArray(products) ? products : []);
  } catch (error: any) {
    console.error('❌ Error obteniendo productos activos:', error);
    
    // En caso de error, devolver array vacío
    return NextResponse.json([]);
  }
}
