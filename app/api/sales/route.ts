import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las ventas
export async function GET() {
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
    });
    return NextResponse.json(sales);
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener ventas' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva venta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, serviceId, amount } = body;

    if (!userId || amount === undefined) {
      return NextResponse.json(
        { error: 'UserId y amount son requeridos' },
        { status: 400 }
      );
    }

    if (!productId && !serviceId) {
      return NextResponse.json(
        { error: 'Debe especificar productId o serviceId' },
        { status: 400 }
      );
    }

    const sale = await prisma.sale.create({
      data: {
        userId,
        productId: productId || null,
        serviceId: serviceId || null,
        amount: parseFloat(amount),
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

    return NextResponse.json(sale, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error al crear venta' },
      { status: 500 }
    );
  }
} 
