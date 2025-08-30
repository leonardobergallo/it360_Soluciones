import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma Client conectado exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
}

// GET - Obtener detalles de una orden específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 Obteniendo detalles de orden: ${params.id}`);
    
    await connectDB();
    
    // Temporalmente usar la tabla Sale existente
    const sale = await prisma.sale.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
            category: true
          }
        }
      }
    });

    if (!sale) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    // Convertir sale a formato de orden
    const order = {
      id: sale.id,
      orderNumber: `SALE-${sale.id.slice(-6)}`,
      total: sale.amount,
      status: sale.status?.toUpperCase() || 'COMPLETED',
      createdAt: sale.createdAt,
      updatedAt: sale.createdAt,
      items: sale.product ? [{
        id: `item-${sale.id}`,
        quantity: 1,
        price: sale.amount,
        product: sale.product
      }] : [],
      shippingMethod: 'pickup',
      paymentMethod: sale.metodoPago || 'cash',
      user: sale.user
    };

    console.log(`✅ Orden encontrada: ${order.orderNumber}`);
    return NextResponse.json(order);

  } catch (error) {
    console.error('❌ Error al obtener orden:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PATCH - Actualizar estado de la orden (temporalmente deshabilitado)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ error: 'Función temporalmente deshabilitada' }, { status: 503 });
}
