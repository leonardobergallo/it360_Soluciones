import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      // Obtener comparación para un producto específico
      const activeProduct = await prisma.product.findUnique({
        where: { id: productId, active: true }
      });
      
      if (!activeProduct) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      }
      
      // Buscar productos inactivos similares por categoría
      const similarInactiveProducts = await prisma.product.findMany({
        where: {
          active: false,
          category: activeProduct.category
        },
        take: 5
      });
      
      // Buscar el producto inactivo más similar por nombre
      let bestMatch = null;
      let bestScore = 0;
      
      for (const inactiveProduct of similarInactiveProducts) {
        const activeWords = activeProduct.name.toLowerCase().split(' ');
        const inactiveWords = inactiveProduct.name.toLowerCase().split(' ');
        
        const commonWords = activeWords.filter(word => 
          inactiveWords.some(inactiveWord => 
            inactiveWord.includes(word) || word.includes(inactiveWord)
          )
        );
        
        const score = commonWords.length / Math.max(activeWords.length, inactiveWords.length);
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = inactiveProduct;
        }
      }
      
      if (bestMatch && bestScore > 0.2) { // Solo si hay al menos 20% de similitud
        const excelPrice = bestMatch.price;
        const currentPrice = activeProduct.price;
        const markupApplied = ((currentPrice - excelPrice) / excelPrice) * 100;
        
        return NextResponse.json({
          success: true,
          comparison: {
            activeProduct: {
              id: activeProduct.id,
              name: activeProduct.name,
              price: activeProduct.price,
              category: activeProduct.category
            },
            excelProduct: {
              id: bestMatch.id,
              name: bestMatch.name,
              price: bestMatch.price
            },
            excelPrice: excelPrice,
            currentPrice: currentPrice,
            markupApplied: markupApplied,
            priceDifference: currentPrice - excelPrice,
            similarity: bestScore
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        comparison: null,
        message: 'No se encontró un producto similar en el Excel'
      });
    }
    
    // Obtener todas las comparaciones
    const activeProducts = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, price: true, category: true }
    });
    
    const comparisons = [];
    
    for (const activeProduct of activeProducts) {
      // Buscar productos inactivos similares por categoría
      const similarInactiveProducts = await prisma.product.findMany({
        where: {
          active: false,
          category: activeProduct.category
        },
        take: 10
      });
      
      // Buscar el producto inactivo más similar
      let bestMatch = null;
      let bestScore = 0;
      
      for (const inactiveProduct of similarInactiveProducts) {
        const activeWords = activeProduct.name.toLowerCase().split(' ');
        const inactiveWords = inactiveProduct.name.toLowerCase().split(' ');
        
        const commonWords = activeWords.filter(word => 
          inactiveWords.some(inactiveWord => 
            inactiveWord.includes(word) || word.includes(inactiveWord)
          )
        );
        
        const score = commonWords.length / Math.max(activeWords.length, inactiveWords.length);
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = inactiveProduct;
        }
      }
      
      if (bestMatch && bestScore > 0.3) { // Solo si hay al menos 30% de similitud
        const excelPrice = bestMatch.price;
        const currentPrice = activeProduct.price;
        const markupApplied = ((currentPrice - excelPrice) / excelPrice) * 100;
        
        comparisons.push({
          activeProduct: {
            id: activeProduct.id,
            name: activeProduct.name,
            price: activeProduct.price,
            category: activeProduct.category
          },
          excelProduct: {
            id: bestMatch.id,
            name: bestMatch.name,
            price: bestMatch.price
          },
          excelPrice: excelPrice,
          currentPrice: currentPrice,
          markupApplied: markupApplied,
          priceDifference: currentPrice - excelPrice,
          similarity: bestScore
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      comparisons: comparisons,
      total: comparisons.length
    });

  } catch (error) {
    console.error('Error getting price comparison:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
