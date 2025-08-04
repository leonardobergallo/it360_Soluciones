import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, updates }: { 
      productIds: string[], 
      updates: {
        basePrice?: number;
        markup?: number;
        stock?: number;
        active?: boolean;
      }
    } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren IDs de productos válidos' },
        { status: 400 }
      );
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Se requieren actualizaciones válidas' },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    let errorCount = 0;

    for (const productId of productIds) {
      try {
        // Preparar los datos de actualización
        const updateData: any = {};

        if (updates.basePrice !== undefined) {
          updateData.basePrice = updates.basePrice;
        }

        if (updates.markup !== undefined) {
          updateData.markup = updates.markup;
        }

        if (updates.stock !== undefined) {
          updateData.stock = updates.stock;
        }

        if (updates.active !== undefined) {
          updateData.active = updates.active;
        }

        // Si se actualiza basePrice o markup, recalcular el precio final
        if (updates.basePrice !== undefined || updates.markup !== undefined) {
          const currentProduct = await prisma.product.findUnique({
            where: { id: productId }
          });

          if (currentProduct) {
            const newBasePrice = updates.basePrice !== undefined ? updates.basePrice : (currentProduct.basePrice || currentProduct.price);
            const newMarkup = updates.markup !== undefined ? updates.markup : (currentProduct.markup || 0);
            
            // Calcular nuevo precio final
            updateData.price = newBasePrice * (1 + newMarkup / 100);
          }
        }

        // Actualizar el producto
        await prisma.product.update({
          where: { id: productId },
          data: updateData
        });

        updatedCount++;
      } catch (error) {
        console.error(`Error actualizando producto ${productId}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      errors: errorCount,
      message: `${updatedCount} productos actualizados exitosamente${errorCount > 0 ? `, ${errorCount} errores` : ''}`
    });

  } catch (error) {
    console.error('Error en bulk update:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 