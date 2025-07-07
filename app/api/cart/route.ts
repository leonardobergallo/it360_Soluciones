import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

// Utilidad para obtener el usuario autenticado
async function getUserIdFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remover 'Bearer '
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as any;
    
    if (!decoded || !decoded.userId) {
      return null;
    }
    
    return decoded.userId as string;
  } catch (error) {
    console.error('Error verificando token:', error);
    return null;
  }
}

// GET: Obtener el carrito del usuario logueado
export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
  if (!cart) {
    // Si no existe, crear uno vacío
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } }
    });
  }
  return NextResponse.json(cart);
}

// POST: Agregar o actualizar un producto en el carrito
export async function POST(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  const { productId, quantity } = await request.json();
  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  // Buscar o crear el carrito
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  // Buscar si el producto ya está en el carrito
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId }
  });
  if (existingItem) {
    // Actualizar cantidad
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity }
    });
  } else {
    // Agregar nuevo producto
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }
  // Devolver el carrito actualizado
  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
  return NextResponse.json(updatedCart);
}

// DELETE: Eliminar un producto del carrito
export async function DELETE(request: NextRequest) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  // Buscar el carrito
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 });
  }
  // Eliminar el producto
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  // Devolver el carrito actualizado
  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
  return NextResponse.json(updatedCart);
} 