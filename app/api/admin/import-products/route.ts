import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

interface ImportedProduct {
  name: string;
  description: string;
  basePrice: number;
  category: string;
  stock: number;
  image?: string;
}

interface CategoryMarkup {
  category: string;
  markup: number;
}

// POST - Procesar archivo Excel o importar productos
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Procesar archivo Excel
      return await processExcelFile(request);
    } else {
      // Importar productos con markup
      return await importProducts(request);
    }
  } catch (error) {
    console.error('Error en import-products:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function processExcelFile(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no soportado. Use .xlsx, .xls o .csv' },
        { status: 400 }
      );
    }

    // Leer el archivo
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: 'El archivo debe tener al menos una fila de encabezados y una fila de datos' },
        { status: 400 }
      );
    }

    // Procesar datos
    const headers = (jsonData[0] as string[]).map(h => h?.toString().toLowerCase().trim());
    const requiredHeaders = ['name', 'description', 'baseprice', 'category', 'stock'];
    
    // Verificar headers requeridos
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { error: `Faltan los siguientes campos: ${missingHeaders.join(', ')}` },
        { status: 400 }
      );
    }

    const products: ImportedProduct[] = [];
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[];
      if (!row || row.length === 0) continue;

      const product: ImportedProduct = {
        name: row[headers.indexOf('name')]?.toString().trim() || '',
        description: row[headers.indexOf('description')]?.toString().trim() || '',
        basePrice: parseFloat(row[headers.indexOf('baseprice')]?.toString() || '0'),
        category: row[headers.indexOf('category')]?.toString().trim().toLowerCase() || '',
        stock: parseInt(row[headers.indexOf('stock')]?.toString() || '0'),
        image: row[headers.indexOf('image')]?.toString().trim() || undefined
      };

      // Validar datos básicos
      if (product.name && product.description && product.basePrice > 0 && product.category) {
        products.push(product);
      }
    }

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron productos válidos en el archivo' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      products,
      message: `${products.length} productos procesados correctamente`
    });

  } catch (error) {
    console.error('Error procesando archivo Excel:', error);
    return NextResponse.json(
      { error: 'Error al procesar el archivo Excel' },
      { status: 500 }
    );
  }
}

async function importProducts(request: NextRequest) {
  try {
    const body = await request.json();
    const { products, categoryMarkups }: { products: ImportedProduct[], categoryMarkups: CategoryMarkup[] } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron productos para importar' },
        { status: 400 }
      );
    }

    let createdCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Calcular precio final con markup
        const markup = categoryMarkups.find(cat => cat.category === product.category)?.markup || 0;
        const finalPrice = product.basePrice * (1 + markup / 100);

        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findFirst({
          where: { name: product.name }
        });

        if (existingProduct) {
          // Actualizar producto existente
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              description: product.description,
              price: finalPrice,
              stock: product.stock,
              category: product.category,
              image: product.image,
              active: true
            }
          });
        } else {
          // Crear nuevo producto
          await prisma.product.create({
            data: {
              name: product.name,
              description: product.description,
              price: finalPrice,
              stock: product.stock,
              category: product.category,
              image: product.image,
              active: true
            }
          });
        }
        
        createdCount++;
      } catch (error) {
        console.error(`Error importando producto ${product.name}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      created: createdCount,
      errors: errorCount,
      message: `Importación completada. ${createdCount} productos procesados, ${errorCount} errores.`
    });

  } catch (error) {
    console.error('Error importando productos:', error);
    return NextResponse.json(
      { error: 'Error al importar productos' },
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
