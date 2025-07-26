import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// POST - Subir productos desde Excel
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Verificar tipo de archivo
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Solo se permiten archivos Excel (.xlsx, .xls)' },
        { status: 400 }
      );
    }

    // Leer el archivo Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'El archivo Excel está vacío' },
        { status: 400 }
      );
    }

    // Validar estructura del Excel
    const requiredColumns = ['name', 'description', 'price', 'stock', 'category'];
    const firstRow = data[0] as any;
    
    for (const column of requiredColumns) {
      if (!(column in firstRow)) {
        return NextResponse.json(
          { error: `Columna requerida faltante: ${column}` },
          { status: 400 }
        );
      }
    }

    // Procesar productos
    let createdCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      
      try {
        // Validar datos
        if (!row.name || !row.description || !row.price || !row.stock || !row.category) {
          errors.push(`Fila ${i + 2}: Datos incompletos`);
          errorCount++;
          continue;
        }

        // Validar tipos de datos
        const price = parseFloat(row.price);
        const stock = parseInt(row.stock);
        
        if (isNaN(price) || price < 0) {
          errors.push(`Fila ${i + 2}: Precio inválido`);
          errorCount++;
          continue;
        }

        if (isNaN(stock) || stock < 0) {
          errors.push(`Fila ${i + 2}: Stock inválido`);
          errorCount++;
          continue;
        }

        // Crear producto
        await prisma.product.create({
          data: {
            name: row.name.toString().trim(),
            description: row.description.toString().trim(),
            price: price,
            stock: stock,
            category: row.category.toString().trim(),
            image: row.image?.toString().trim() || null,
            active: row.active !== undefined ? Boolean(row.active) : true
          }
        });

        createdCount++;
      } catch (error) {
        errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Productos procesados: ${createdCount} creados, ${errorCount} errores`,
      createdCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error procesando archivo Excel:', error);
    return NextResponse.json(
      { error: 'Error procesando el archivo Excel' },
      { status: 500 }
    );
  }
}

// GET - Descargar plantilla Excel
export async function GET() {
  try {
    // Crear plantilla de ejemplo
    const template = [
      {
        name: 'Producto Ejemplo',
        description: 'Descripción del producto',
        price: 100.00,
        stock: 10,
        category: 'hardware',
        image: 'https://ejemplo.com/imagen.jpg',
        active: true
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="plantilla-productos.xlsx"'
      }
    });

  } catch (error) {
    console.error('Error generando plantilla:', error);
    return NextResponse.json(
      { error: 'Error generando plantilla' },
      { status: 500 }
    );
  }
} 