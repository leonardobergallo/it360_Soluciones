const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixInvalidImagePaths() {
  try {
    console.log('🔧 CORRIGIENDO RUTAS DE IMAGEN INVÁLIDAS');
    console.log('=' .repeat(50));
    
    // Obtener productos con rutas de imagen inválidas
    const products = await prisma.product.findMany({
      where: { 
        active: true,
        image: {
          not: 'USE_NAME'
        }
      },
      select: { id: true, name: true, category: true, image: true }
    });
    
    let fixed = 0;
    
    for (const product of products) {
      // Verificar si la imagen tiene una ruta inválida
      if (product.image && 
          !product.image.startsWith('/images/') && 
          !product.image.startsWith('http') &&
          product.image !== 'USE_NAME') {
        
        console.log(`🔧 Corrigiendo: ${product.name}`);
        console.log(`   Imagen actual: ${product.image}`);
        
        // Cambiar a USE_NAME
        await prisma.product.update({
          where: { id: product.id },
          data: { image: 'USE_NAME' }
        });
        
        console.log(`   ✅ Cambiado a: USE_NAME`);
        fixed++;
      }
    }
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`✅ Productos corregidos: ${fixed}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixInvalidImagePaths();
