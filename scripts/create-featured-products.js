const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createFeaturedProducts() {
  try {
    console.log('🔥 Creando productos destacados para la sección "Más Vendidos"...\n');

    const featuredProducts = [
      {
        name: 'Laptop Gaming HP Omen',
        description: 'Laptop gaming de alto rendimiento con RTX 4060, 16GB RAM, 1TB SSD, pantalla 15.6" 144Hz',
        price: 250000,
        stock: 8,
        category: 'hardware',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        active: true
      },
      {
        name: 'Mouse Gaming Logitech G Pro X',
        description: 'Mouse gaming inalámbrico con sensor HERO 25K, 25,600 DPI, RGB, 70 horas de batería',
        price: 45000,
        stock: 25,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        active: true
      },
      {
        name: 'Monitor Samsung Odyssey G7',
        description: 'Monitor gaming curvo 32" 240Hz, 1440p, 1ms, FreeSync Premium Pro, HDR600',
        price: 320000,
        stock: 12,
        category: 'monitores',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        active: true
      },
      {
        name: 'SSD Samsung 970 EVO Plus 2TB',
        description: 'SSD NVMe M.2 2TB, velocidad de lectura 3,500MB/s, escritura 3,300MB/s, 5 años garantía',
        price: 85000,
        stock: 30,
        category: 'almacenamiento',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
        active: true
      },
      {
        name: 'Router WiFi 6 TP-Link Archer AX90',
        description: 'Router WiFi 6 AX6600, 6.6 Gbps, 8 antenas, MU-MIMO, OFDMA, VPN Server',
        price: 65000,
        stock: 15,
        category: 'redes',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        active: true
      }
    ];

    let createdCount = 0;
    let errorCount = 0;

    for (const product of featuredProducts) {
      try {
        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findFirst({
          where: {
            name: product.name
          }
        });

        if (existingProduct) {
          console.log(`⚠️  Producto ya existe: ${product.name}`);
          continue;
        }

        await prisma.product.create({
          data: product
        });
        createdCount++;
        console.log(`✅ Creado producto destacado: ${product.name} - $${product.price.toLocaleString()}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creando producto ${product.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de creación de productos destacados:');
    console.log(`   ✅ Creados exitosamente: ${createdCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${featuredProducts.length}`);

    if (createdCount > 0) {
      console.log('\n🎉 Productos destacados creados exitosamente!');
      console.log('💡 Ahora puedes ver la sección "Más Vendidos" en la página principal.');
      console.log('🔥 Estos productos aparecerán con el badge "Oferta" y colores naranja/rojo.');
    }

  } catch (error) {
    console.error('❌ Error durante la creación de productos destacados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFeaturedProducts(); 