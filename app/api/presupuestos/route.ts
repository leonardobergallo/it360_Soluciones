import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todos los presupuestos
export async function GET() {
  try {
    const presupuestos = await prisma.presupuesto.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(presupuestos);
  } catch (error) {
    console.error('Error al obtener presupuestos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo presupuesto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, empresa, servicio, mensaje } = body;

    // Validaciones básicas
    if (!nombre || !email || !servicio) {
      return NextResponse.json(
        { error: 'Nombre, email y servicio son requeridos' },
        { status: 400 }
      );
    }

    const presupuesto = await prisma.presupuesto.create({
      data: {
        nombre,
        email,
        telefono,
        empresa,
        servicio,
        mensaje,
        estado: 'pendiente',
      },
    });

    return NextResponse.json(presupuesto, { status: 201 });
  } catch (error) {
    console.error('Error al crear presupuesto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 