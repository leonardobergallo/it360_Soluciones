const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function findBrokenImages() {
  try {
    console.log('🔍 BUSCANDO IMÁGENES ROTAS');
    console.log('=' .repeat(50));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, category: true, image: true }
    });
    
    console.log(`📦 Productos a verificar: ${products.length}`);
    console.log('');
    
    const brokenImages = [];
    const validImages = [];
    
    for (const product of products) {
      if (!product.image) {
        brokenImages.push({
          ...product,
          reason: 'Sin imagen'
        });
        continue;
      }
      
      // Verificar si es una URL externa (placeholder)
      if (product.image.startsWith('http')) {
        validImages.push({
          ...product,
          reason: 'URL externa'
        });
        continue;
      }
      
      // Verificar si es una ruta local
      if (product.image.startsWith('/images/')) {
        const imagePath = path.join('public', product.image);
        
        if (fs.existsSync(imagePath)) {
          validImages.push({
            ...product,
            reason: 'Imagen local válida'
          });
        } else {
          brokenImages.push({
            ...product,
            reason: `Archivo no existe: ${imagePath}`
          });
        }
      } else {
        brokenImages.push({
          ...product,
          reason: 'Ruta inválida'
        });
      }
    }
    
    // Mostrar resultados
    console.log('❌ IMÁGENES ROTAS:');
    console.log('=' .repeat(30));
    console.log(`Total: ${brokenImages.length}`);
    console.log('');
    
    brokenImages.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Categoría: ${product.category}`);
      console.log(`   Imagen: ${product.image}`);
      console.log(`   Razón: ${product.reason}`);
      console.log('');
    });
    
    console.log('✅ IMÁGENES VÁLIDAS:');
    console.log('=' .repeat(30));
    console.log(`Total: ${validImages.length}`);
    
    // Estadísticas por categoría
    const categoryStats = {};
    brokenImages.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category]++;
    });
    
    console.log('\n📊 IMÁGENES ROTAS POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });
    
    return brokenImages;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
findBrokenImages();
