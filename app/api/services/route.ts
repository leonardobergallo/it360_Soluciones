import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los servicios
export async function GET() {
  try {
    const services = await prisma.service.findMany();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price } = body;

    if (!name || !description || price === undefined) {
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
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    );
  }
} 
