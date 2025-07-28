import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Actualizar un servicio específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, active } = body;

    // Validar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el servicio
    const updatedService = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Error actualizando servicio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar servicio' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un servicio específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar que el servicio existe
    const existingService = await prisma.service.findUnique({
      where: { id: params.id }
    });

    if (!existingService) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el servicio
    await prisma.service.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando servicio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar servicio' },
      { status: 500 }
    );
  }
} 