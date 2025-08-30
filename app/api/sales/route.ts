import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener ventas (todas para admin, del usuario para usuarios)
export async function GET(request: NextRequest) {
  try {
    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Verificar si hay token de autorización
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = JSON.parse(atob(token.split('.')[1]));
        userId = decoded.userId;
      } catch (error) {
        console.log('Error decodificando token:', error);
      }
    }

    // Si hay userId, filtrar por usuario, sino obtener todas (para admin)
    const whereClause = userId ? { userId } : {};

    const sales = await prisma.sale.findMany({
      where: whereClause,
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

    await prisma.$disconnect();
    return NextResponse.json(sales);
  } catch (error: any) {
    console.error('Error obteniendo ventas:', error);
    return NextResponse.json(
      { error: 'Error al obtener ventas', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva venta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, serviceId, amount, nombre, email, telefono, direccion, metodoPago } = body;

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

    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const sale = await prisma.sale.create({
      data: {
        userId,
        productId: productId || null,
        serviceId: serviceId || null,
        amount: parseFloat(amount),
        nombre: nombre || null,
        email: email || null,
        telefono: telefono || null,
        direccion: direccion || null,
        metodoPago: metodoPago || 'reembolso',
        status: 'pending'
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

    await prisma.$disconnect();
    return NextResponse.json(sale, { status: 201 });
  } catch (error: any) {
    console.error('Error creating sale:', error);
    return NextResponse.json(
      { error: 'Error al crear venta', details: error.message },
      { status: 500 }
    );
  }
} 
