import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

// Utilidad para obtener el usuario autenticado
async function getUserIdFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, error: 'No autenticado' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as DecodedToken;
    if (!decoded || !decoded.userId) {
      return { userId: null, error: 'Token inválido' };
    }
    return { userId: decoded.userId, error: null };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return { userId: null, error: 'Token expirado' };
    }
    return { userId: null, error: 'Error verificando token' };
  }
}

// POST: Migrar productos del localStorage al carrito del backend
export async function POST(request: NextRequest) {
  const { userId, error } = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: error || 'No autenticado' }, { status: 401 });
  }

  try {
    const { localStorageItems } = await request.json();
    
    if (!localStorageItems || !Array.isArray(localStorageItems)) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    // Filtrar solo productos (no cotizaciones)
    const productsToMigrate = localStorageItems.filter((item: { type?: string; productId?: string }) => 
      item.type !== 'cotizacion' && item.productId
    );

    if (productsToMigrate.length === 0) {
      return NextResponse.json({ message: 'No hay productos para migrar' });
    }

    // Buscar o crear el carrito
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    let migratedCount = 0;
    const errors: string[] = [];

    // Migrar cada producto
    for (const item of productsToMigrate) {
      try {
        // Verificar que el producto existe
        const product = await prisma.product.findUnique({ 
          where: { id: item.productId } 
        });
        
        if (!product) {
          errors.push(`Producto ${item.productId} no encontrado`);
          continue;
        }

        // Verificar si ya existe en el carrito
        const existingItem = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, productId: item.productId }
        });

        if (existingItem) {
          // Actualizar cantidad sumando la del localStorage
          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + (item.quantity || 1) }
          });
        } else {
          // Crear nuevo item
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              quantity: item.quantity || 1
            }
          });
        }
        
        migratedCount++;
      } catch (itemError) {
        errors.push(`Error migrando producto ${item.productId}: ${itemError}`);
      }
    }

    // Obtener el carrito actualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    return NextResponse.json({
      message: `Migración completada: ${migratedCount} productos migrados`,
      migratedCount,
      errors: errors.length > 0 ? errors : undefined,
      cart: updatedCart
    });

  } catch (error) {
    console.error('Error en migración de carrito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 