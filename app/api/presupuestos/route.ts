import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los presupuestos
export async function GET() {
  try {
    console.log('🔍 Buscando presupuestos en la base de datos...');
    
    // Verificar si la tabla existe intentando contar registros
    const count = await prisma.presupuesto.count();
    console.log(`📊 Total de presupuestos encontrados: ${count}`);
    
    const presupuestos = await prisma.presupuesto.findMany({ 
      orderBy: { createdAt: 'desc' } 
    });
    
    console.log('✅ Presupuestos obtenidos exitosamente:', presupuestos.length);
    return NextResponse.json(presupuestos);
  } catch (error) {
    console.error('❌ Error al obtener presupuestos:', error);
    return NextResponse.json({ 
      error: 'Error al obtener presupuestos', 
      details: error instanceof Error ? error.message : 'Error desconocido' 
    }, { status: 500 });
  }
}

// POST - Crear un nuevo presupuesto
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('📝 Creando nuevo presupuesto:', data);
    
    const nuevo = await prisma.presupuesto.create({ data });
    console.log('✅ Presupuesto creado exitosamente:', nuevo.id);
    
    return NextResponse.json(nuevo, { status: 201 });
  } catch (error) {
    console.error('❌ Error al crear presupuesto:', error);
    return NextResponse.json({ 
      error: 'Error al crear presupuesto', 
      details: error instanceof Error ? error.message : 'Error desconocido' 
    }, { status: 500 });
  }
} 