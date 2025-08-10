import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Utilidad para obtener el usuario autenticado
async function getUserIdFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { userId: null, error: 'No autenticado' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    if (!decoded || !decoded.userId) {
      return { userId: null, error: 'Token inválido' };
    }
    return { userId: decoded.userId as string, error: null };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { userId: null, error: 'Token expirado' };
    }
    return { userId: null, error: 'Error verificando token' };
  }
}

// POST: Vaciar completamente el carrito del usuario
export async function POST(request: NextRequest) {
  const { userId, error } = await getUserIdFromRequest(request);
  if (!userId) {
    let message = error || 'No autenticado';
    return NextResponse.json({ error: message }, { status: 401 });
  }

  try {
    // Buscar el carrito del usuario
    const cart = await prisma.cart.findUnique({ 
      where: { userId },
      include: { items: true }
    });

    if (!cart) {
      return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 });
    }

    // Eliminar todos los items del carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    // Devolver el carrito vacío
    const emptyCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    return NextResponse.json({
      success: true,
      message: 'Carrito vaciado exitosamente',
      cart: emptyCart
    });

  } catch (error) {
    console.error('Error vaciando carrito:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
