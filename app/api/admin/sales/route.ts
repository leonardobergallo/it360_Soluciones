import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Obtener todas las ventas para el administrador
export async function GET(request: NextRequest) {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(sales);
  } catch (error: any) {
    console.error('Error obteniendo ventas para admin:', error);
    return NextResponse.json(
      { error: 'Error al obtener ventas', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de una venta (aprobar/rechazar)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { saleId, status, adminNotes } = body;

    if (!saleId || !status) {
      return NextResponse.json(
        { error: 'SaleId y status son requeridos' },
        { status: 400 }
      );
    }

    // Validar que el status sea válido
    const validStatuses = ['pending', 'approved', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido. Debe ser: pending, approved, completed, o cancelled' },
        { status: 400 }
      );
    }

    // Actualizar la venta
    const updatedSale = await prisma.sale.update({
      where: { id: saleId },
      data: {
        status,
        adminNotes: adminNotes || null,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });

    console.log(`✅ Venta ${saleId} actualizada a estado: ${status}`);
    
    // Si se aprueba, enviar notificación al usuario
    if (status === 'approved') {
      console.log(`📧 Enviando notificación de aprobación a: ${updatedSale.user?.email}`);
      // Aquí podrías enviar un email al usuario
    }

    return NextResponse.json(updatedSale);
  } catch (error: any) {
    console.error('Error actualizando venta:', error);
    return NextResponse.json(
      { error: 'Error al actualizar venta', details: error.message },
      { status: 500 }
    );
  }
}
