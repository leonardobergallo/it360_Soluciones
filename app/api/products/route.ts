import { NextRequest, NextResponse } from 'next/server';
import { prisma, connectPrisma, disconnectPrisma } from '@/lib/prisma';

// GET - Obtener todos los productos
export async function GET() {
  try {
    console.log('🔍 Obteniendo productos de la base de datos...');
    
    // Conectar explícitamente a Prisma
    await connectPrisma();
    console.log('✅ Conexión a la base de datos establecida');
    
    const products = await prisma.product.findMany({
      where: {
        active: true // Solo productos activos
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`📦 Productos encontrados: ${products.length}`);
    
    if (products.length === 0) {
      console.log('⚠️  No se encontraron productos activos');
      return NextResponse.json([]);
    }
    
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('❌ Error obteniendo productos:', error);
    
    // Manejo específico de errores de Prisma
    if (error.code === 'P1001' || error.message?.includes('Engine is not yet connected')) {
      return NextResponse.json(
        { 
          error: 'Error de conexión a la base de datos',
          details: 'No se pudo conectar a la base de datos',
          solution: 'Verifica que la base de datos esté activa'
        },
        { status: 503 }
      );
    }
    
    if (error.message?.includes('Can\'t reach database server')) {
      return NextResponse.json(
        { 
          error: 'No se puede conectar a la base de datos',
          details: 'La base de datos no está accesible',
          solution: 'Verifica que la base de datos esté activa y las credenciales sean correctas'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error al obtener productos',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor',
        solution: 'Revisa los logs del servidor para más detalles'
      },
      { status: 500 }
    );
  } finally {
    await disconnectPrisma();
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

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        basePrice: basePrice ? parseFloat(basePrice) : null,
        markup: markup ? parseFloat(markup) : null,
        stock: parseInt(stock),
        category: category || 'general',
        image,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
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
    if (image !== undefined) data.image = image;
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
