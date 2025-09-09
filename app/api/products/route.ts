import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Normaliza rutas de imagen para servir desde /public
function normalizeImagePath(image?: string): string | undefined {
  if (!image) return image;
  // Si es URL http(s), dejar tal cual
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  // Reemplazar backslashes por forward slashes por si viniera de Windows
  const normalized = image.replace(/\\/g, '/');
  // Si contiene /public/, mapear a ruta web
  const publicIdx = normalized.indexOf('/public/');
  if (publicIdx >= 0) {
    return normalized.slice(publicIdx + '/public'.length);
  }
  // Si es una ruta absoluta al proyecto que incluye /images/, intentar quedarnos desde /images/
  const imagesIdx = normalized.indexOf('/images/');
  if (imagesIdx >= 0) {
    return normalized.slice(imagesIdx);
  }
  // Si ya empieza con /, es ruta relativa web válida
  if (normalized.startsWith('/')) return normalized;
  // En último caso, asumir que es un nombre de archivo dentro de /images
  return `/images/${normalized}`;
}

// GET - Obtener todos los productos
export async function GET() {
  try {
    console.log('🔍 Obteniendo productos...');
    
    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Intentar conectar a la base de datos con timeout
    const products = await Promise.race([
      prisma.product.findMany({
        // Cargar TODOS los productos (activos e inactivos)
        // El filtro se aplicará en el frontend
        orderBy: {
          name: 'asc'
        }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout de conexión a la base de datos')), 10000)
      )
    ]) as any[];
    
    console.log(`✅ ${products.length} productos encontrados`);
    
    await prisma.$disconnect();
    
    // Asegurar que siempre devolvemos un array
    return NextResponse.json(Array.isArray(products) ? products : []);
  } catch (error: any) {
    console.error('❌ Error obteniendo productos:', error);
    
    // En caso de error, devolver un array vacío para evitar que data.map falle
    // Esto permite que la aplicación funcione aunque la base de datos no esté disponible
    console.log('⚠️ Devolviendo array vacío debido a error de conexión');
    
    // Log del error para debugging
    if (error.code === 'P6001') {
      console.error('Error de configuración de base de datos:', error.message);
    } else if (error.message?.includes('Can\'t reach database server')) {
      console.error('No se puede conectar a la base de datos Neon:', error.message);
    } else {
      console.error('Error general:', error.message);
    }
    
    // Siempre devolver un array vacío para mantener la funcionalidad de la UI
    return NextResponse.json([]);
  }
}

// POST - Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, basePrice, markup, stock, category, image } = body;

    if (!name || !description || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Name, description, price y stock son requeridos' },
        { status: 400 }
      );
    }

    // Importar Prisma dinámicamente
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        basePrice: basePrice ? parseFloat(basePrice) : null,
        markup: markup ? parseFloat(markup) : null,
        stock: parseInt(stock),
        category: category || 'general',
        image: normalizeImagePath(image),
      },
    });

    await prisma.$disconnect();
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    
    // Manejo específico de errores
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un producto con ese nombre' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear producto', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un producto por id
export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, price, basePrice, markup, stock, category, image, active } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }
    
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (basePrice !== undefined) data.basePrice = basePrice ? parseFloat(basePrice) : null;
    if (markup !== undefined) data.markup = markup ? parseFloat(markup) : null;
    if (stock !== undefined) data.stock = parseInt(stock);
    if (category !== undefined) data.category = category;
    if (image !== undefined) data.image = normalizeImagePath(image);
    if (active !== undefined) data.active = active;
    
    const product = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE - Eliminar un producto por id
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
} 
