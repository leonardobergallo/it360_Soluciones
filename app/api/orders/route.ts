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

// GET - Obtener órdenes del usuario
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Obteniendo órdenes del usuario...');
    
    // Conectar a la base de datos
    await connectDB();
    
    // Obtener userId del header de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    // Aquí deberías validar el token y obtener el userId
    // Por ahora, usaremos un userId hardcodeado para testing
    const userId = 'test-user-id'; // TODO: Implementar autenticación real

    // Temporalmente usar la tabla Sale existente hasta que se regenere el cliente
    const sales = await prisma.sale.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Convertir sales a formato de órdenes
    const orders = sales.map(sale => ({
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
      paymentMethod: sale.metodoPago || 'cash'
    }));

    console.log(`✅ ${orders.length} órdenes encontradas`);
    return NextResponse.json(orders);

  } catch (error) {
    console.error('❌ Error al obtener órdenes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Crear nueva orden (temporalmente deshabilitado hasta regenerar cliente)
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Función temporalmente deshabilitada' }, { status: 503 });
}
