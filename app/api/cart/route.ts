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

    const token = authHeader.substring(7); // Remover 'Bearer '
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

// GET: Obtener el carrito del usuario logueado
export async function GET(request: NextRequest) {
  const { userId, error } = await getUserIdFromRequest(request);
  if (!userId) {
    // Si no hay usuario autenticado, devolver carrito vacío en lugar de error
    console.log('⚠️ Usuario no autenticado, devolviendo carrito vacío');
    return NextResponse.json({
      id: 'temp-cart',
      userId: null,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  try {
    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
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
  } catch (error: any) {
    console.error('Error en GET /api/cart:', error);
    
    // Si hay error de conexión a la base de datos, devolver carrito vacío
    if (error.message?.includes("Can't reach database server") || 
        error.code === 'P1001' || 
        error.name === 'PrismaClientInitializationError') {
      console.log('⚠️ Error de conexión a BD, devolviendo carrito vacío');
      return NextResponse.json({
        id: 'temp-cart',
        userId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST: Agregar o actualizar un producto en el carrito
export async function POST(request: NextRequest) {
  const { userId, error } = await getUserIdFromRequest(request);
  if (!userId) {
    console.log('⚠️ Usuario no autenticado, no se puede agregar al carrito');
    return NextResponse.json({ 
      error: 'Debes iniciar sesión para agregar productos al carrito' 
    }, { status: 401 });
  }
  const { productId, quantity } = await request.json();
  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  // Validar que el producto exista y sea un producto real
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: 'Solo se pueden agregar productos válidos al carrito' }, { status: 400 });
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

// DELETE: Eliminar un producto del carrito o limpiar todo
export async function DELETE(request: NextRequest) {
  const { userId, error } = await getUserIdFromRequest(request);
  if (!userId) {
    console.log('⚠️ Usuario no autenticado, no se puede eliminar del carrito');
    return NextResponse.json({ 
      error: 'Debes iniciar sesión para modificar el carrito' 
    }, { status: 401 });
  }
  
  const body = await request.json();
  const { productId, clearAll } = body;
  
  // Buscar el carrito
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return NextResponse.json({ error: 'Carrito no encontrado' }, { status: 404 });
  }
  
  if (clearAll) {
    // Limpiar todo el carrito
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    console.log('✅ Carrito completamente limpiado');
  } else if (productId) {
    // Eliminar un producto específico
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  } else {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  
  // Devolver el carrito actualizado
  const updatedCart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
  return NextResponse.json(updatedCart);
} 
