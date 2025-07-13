import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Actualizar estado de un presupuesto
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { estado } = body;

    if (!estado) {
      return NextResponse.json(
        { error: 'Estado es requerido' },
        { status: 400 }
      );
    }

    const presupuesto = await prisma.presupuesto.update({
      where: { id },
      data: { estado },
    });

    return NextResponse.json(presupuesto);
  } catch (error) {
    console.error('Error al actualizar presupuesto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener un presupuesto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id },
    });

    if (!presupuesto) {
      return NextResponse.json(
        { error: 'Presupuesto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(presupuesto);
  } catch (error) {
    console.error('Error al obtener presupuesto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 