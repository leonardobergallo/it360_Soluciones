const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProductsWithImages() {
  try {
    console.log('🔍 Verificando productos con fotos disponibles...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      orderBy: {
        category: 'asc'
      }
    });

    console.log(`📦 Total de productos encontrados: ${products.length}\n`);

    // Productos con imágenes personalizadas
    const productsWithCustomImages = products.filter(p => 
      p.image && p.image.startsWith('/images/')
    );

    // Productos con imágenes de Unsplash
    const productsWithUnsplashImages = products.filter(p => 
      p.image && p.image.includes('unsplash.com')
    );

    // Productos con imágenes por defecto
    const productsWithDefaultImages = products.filter(p => 
      p.image && p.image.startsWith('/servicio-')
    );

    // Productos sin imágenes
    const productsWithoutImages = products.filter(p => 
      !p.image
    );

    console.log('📊 RESUMEN DE IMÁGENES:');
    console.log('=' .repeat(50));
    console.log(`✅ Con imágenes personalizadas (/images/): ${productsWithCustomImages.length}`);
    console.log(`🌐 Con imágenes de Unsplash: ${productsWithUnsplashImages.length}`);
    console.log(`🖼️  Con imágenes por defecto (/servicio-): ${productsWithDefaultImages.length}`);
    console.log(`❌ Sin imágenes: ${productsWithoutImages.length}`);
    console.log('');

    // Mostrar productos con imágenes personalizadas
    if (productsWithCustomImages.length > 0) {
      console.log('🎯 PRODUCTOS CON FOTOS PERSONALIZADAS:');
      console.log('=' .repeat(50));
      productsWithCustomImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   📸 Imagen: ${product.image}`);
        console.log(`   🏷️  Categoría: ${product.category}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString()}`);
        console.log('');
      });
    }

    // Mostrar productos con imágenes de Unsplash
    if (productsWithUnsplashImages.length > 0) {
      console.log('🌐 PRODUCTOS CON IMÁGENES DE UNSPLASH:');
      console.log('=' .repeat(50));
      productsWithUnsplashImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   📸 Imagen: ${product.image}`);
        console.log(`   🏷️  Categoría: ${product.category}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString()}`);
        console.log('');
      });
    }

    // Mostrar productos sin imágenes
    if (productsWithoutImages.length > 0) {
      console.log('⚠️  PRODUCTOS SIN IMÁGENES:');
      console.log('=' .repeat(50));
      productsWithoutImages.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   🏷️  Categoría: ${product.category}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString()}`);
        console.log('');
      });
    }

    // Resumen por categoría
    console.log('📈 RESUMEN POR CATEGORÍA:');
    console.log('=' .repeat(50));
    
    const categoryStats = {};
    products.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = {
          total: 0,
          withImages: 0,
          withoutImages: 0
        };
      }
      
      categoryStats[product.category].total++;
      
      if (product.image) {
        categoryStats[product.category].withImages++;
      } else {
        categoryStats[product.category].withoutImages++;
      }
    });

    Object.entries(categoryStats).forEach(([category, stats]) => {
      console.log(`${category}:`);
      console.log(`   📦 Total: ${stats.total}`);
      console.log(`   ✅ Con imágenes: ${stats.withImages}`);
      console.log(`   ❌ Sin imágenes: ${stats.withoutImages}`);
      console.log(`   📊 Porcentaje: ${Math.round((stats.withImages / stats.total) * 100)}%`);
      console.log('');
    });

    console.log('🎉 Verificación completada!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkProductsWithImages();
