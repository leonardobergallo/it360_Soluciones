import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Verificar si el usuario es administrador
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isAdmin: false, error: 'No autenticado' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024') as { userId: string };
    
    if (!decoded || !decoded.userId) {
      return { isAdmin: false, error: 'Token inválido' };
    }

    // Verificar que el usuario existe y es admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'ADMIN') {
      return { isAdmin: false, error: 'No autorizado' };
    }

    return { isAdmin: true, userId: decoded.userId };
  } catch {
    return { isAdmin: false, error: 'Error verificando permisos' };
  }
}

// POST - Importar productos desde CSV
export async function POST(request: NextRequest) {
  const { isAdmin, error } = await verifyAdmin(request);
  
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron productos para importar' },
        { status: 400 }
      );
    }

    let imported = 0;
    const errors: string[] = [];

    // Importar productos uno por uno
    for (const productData of products) {
      try {
        // Mapear campos del CSV a la estructura de la base de datos
        const mappedProduct = {
          name: productData.nombre || productData.name,
          description: `${productData.nombre || productData.name} - ${productData.categoría || productData.category || 'Producto'}`,
          price: parseFloat(productData.precio || productData.price || '0'),
          stock: parseInt(productData.stock || '10'), // Stock por defecto si no está en el CSV
          category: productData.categoría || productData.category || 'General',
          image: productData.imagen || productData.image || null
        };

        // Validar datos del producto mapeado
        if (!mappedProduct.name || !mappedProduct.price || mappedProduct.price <= 0) {
          errors.push(`Producto "${mappedProduct.name || 'Sin nombre'}": Faltan campos requeridos o precio inválido`);
          continue;
        }

        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findUnique({
          where: { name: mappedProduct.name }
        });

        if (existingProduct) {
          // Actualizar producto existente
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              description: mappedProduct.description,
              price: mappedProduct.price,
              stock: mappedProduct.stock,
              category: mappedProduct.category,
              image: mappedProduct.image
            }
          });
        } else {
          // Crear nuevo producto
          await prisma.product.create({
            data: mappedProduct
          });
        }

        imported++;
      } catch (productError) {
        console.error('Error importando producto:', productData.name, productError);
        errors.push(`Error importando "${productData.name}": ${productError}`);
      }
    }

    // Log de la importación
    console.log(`📦 IMPORTACIÓN MASIVA DE PRODUCTOS:`);
    console.log(`✅ Productos importados: ${imported}`);
    console.log(`❌ Errores: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Errores detallados:', errors);
    }

    return NextResponse.json({
      success: true,
      imported,
      errors: errors.length,
      errorDetails: errors,
      message: `Se importaron ${imported} productos exitosamente${errors.length > 0 ? ` con ${errors.length} errores` : ''}`
    });

  } catch (error) {
    console.error('Error en importación masiva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor durante la importación' },
      { status: 500 }
    );
  }
}

// GET - Obtener estadísticas de productos
export async function GET(request: NextRequest) {
  const { isAdmin, error } = await verifyAdmin(request);
  
  if (!isAdmin) {
    return NextResponse.json({ error }, { status: 401 });
  }

  try {
    const totalProducts = await prisma.product.count();
    const categories = await prisma.product.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    return NextResponse.json({
      totalProducts,
      categories: categories.map(cat => ({
        name: cat.category,
        count: cat._count.category
      }))
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
