const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedProducts() {
  try {
    console.log('🌱 Poblando base de datos con productos de ejemplo...\n');

    const products = [
      {
        name: 'Laptop HP Pavilion',
        description: 'Laptop HP Pavilion 15.6" Intel Core i5, 8GB RAM, 512GB SSD, Windows 11',
        price: 899.99,
        stock: 15,
        category: 'hardware',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        active: true
      },
      {
        name: 'Mouse Inalámbrico Logitech',
        description: 'Mouse inalámbrico Logitech M185, 1000 DPI, batería de 12 meses',
        price: 25.99,
        stock: 50,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        active: true
      },
      {
        name: 'Teclado Mecánico RGB',
        description: 'Teclado mecánico gaming con switches Cherry MX Red y retroiluminación RGB',
        price: 129.99,
        stock: 20,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
        active: true
      },
      {
        name: 'Monitor Samsung 24"',
        description: 'Monitor Samsung 24" Full HD, 75Hz, FreeSync, HDMI, VGA',
        price: 199.99,
        stock: 30,
        category: 'monitores',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
        active: true
      },
      {
        name: 'Disco Duro Externo 1TB',
        description: 'Disco duro externo Western Digital 1TB, USB 3.0, compatible con PC y Mac',
        price: 59.99,
        stock: 25,
        category: 'almacenamiento',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
        active: true
      },
      {
        name: 'Webcam HD 1080p',
        description: 'Webcam Logitech C920 HD 1080p, micrófono integrado, compatible con Zoom/Teams',
        price: 79.99,
        stock: 40,
        category: 'perifericos',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        active: true
      },
      {
        name: 'Router WiFi 6',
        description: 'Router TP-Link Archer AX10 WiFi 6, 1500 Mbps, 4 antenas, fácil configuración',
        price: 89.99,
        stock: 12,
        category: 'redes',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        active: true
      },
      {
        name: 'Impresora Multifunción',
        description: 'Impresora HP DeskJet 3755 multifunción, WiFi, escáner, copiadora',
        price: 149.99,
        stock: 18,
        category: 'impresoras',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        active: true
      },
      {
        name: 'Cable HDMI 2.0',
        description: 'Cable HDMI 2.0 de alta velocidad, 4K, 3 metros, dorado',
        price: 12.99,
        stock: 100,
        category: 'cables',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        active: true
      },
      {
        name: 'Soporte para Monitor',
        description: 'Soporte para monitor articulado, hasta 27", ajustable, VESA 75x75/100x100',
        price: 45.99,
        stock: 35,
        category: 'accesorios',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        active: true
      }
    ];

    let createdCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        await prisma.product.create({
          data: product
        });
        createdCount++;
        console.log(`✅ Creado producto: ${product.name} - $${product.price}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creando producto ${product.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de creación de productos:');
    console.log(`   ✅ Creados exitosamente: ${createdCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${products.length}`);

    if (createdCount > 0) {
      console.log('\n🎉 Productos de ejemplo creados exitosamente!');
      console.log('💡 Ahora puedes probar la funcionalidad de subir Excel.');
    }

  } catch (error) {
    console.error('❌ Error durante la creación de productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts(); 