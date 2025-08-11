import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndCreateProducts() {
  console.log('🔍 Verificando productos en Neon...\n');

  try {
    // Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión a Neon establecida');

    // Contar productos existentes
    const productCount = await prisma.product.count();
    console.log(`📦 Productos existentes: ${productCount}`);

    if (productCount === 0) {
      console.log('⚠️  No hay productos. Creando productos de ejemplo...\n');
      
      const sampleProducts = [
        {
          name: "Laptop HP Pavilion",
          description: "Laptop HP Pavilion 15.6 pulgadas, Intel Core i5, 8GB RAM, 512GB SSD",
          price: 899.99,
          basePrice: 750.00,
          markup: 20.00,
          stock: 10,
          category: "Notebook",
          image: "/servicio-pc.png",
          active: true
        },
        {
          name: "Mouse Inalámbrico Logitech",
          description: "Mouse inalámbrico Logitech M185, 1000 DPI, batería de 12 meses",
          price: 29.99,
          basePrice: 20.00,
          markup: 50.00,
          stock: 50,
          category: "Periferico",
          image: "/servicio-productos.png",
          active: true
        },
        {
          name: "Teclado Mecánico RGB",
          description: "Teclado mecánico gaming con switches blue y retroiluminación RGB",
          price: 89.99,
          basePrice: 60.00,
          markup: 50.00,
          stock: 25,
          category: "Periferico",
          image: "/servicio-software.png",
          active: true
        },
        {
          name: "Monitor Samsung 24\"",
          description: "Monitor Samsung 24 pulgadas Full HD, 60Hz, panel IPS",
          price: 199.99,
          basePrice: 150.00,
          markup: 33.33,
          stock: 15,
          category: "Monitores",
          image: "/servicio-pc.png",
          active: true
        },
        {
          name: "Disco Duro Externo 1TB",
          description: "Disco duro externo Western Digital 1TB, USB 3.0",
          price: 59.99,
          basePrice: 40.00,
          markup: 50.00,
          stock: 30,
          category: "Almacena",
          image: "/servicio-productos.png",
          active: true
        }
      ];

      for (const product of sampleProducts) {
        try {
          await prisma.product.create({ data: product });
          console.log(`✅ Creado: ${product.name} - $${product.price}`);
        } catch (error) {
          console.log(`❌ Error creando ${product.name}: ${error.message}`);
        }
      }

      console.log('\n📊 Productos creados exitosamente');
    } else {
      // Mostrar productos existentes
      const products = await prisma.product.findMany({
        select: { id: true, name: true, price: true, active: true, category: true }
      });
      
      console.log('📋 Productos existentes:');
      products.forEach(p => {
        console.log(`   • ${p.name} - $${p.price} (${p.category}, Activo: ${p.active})`);
      });
    }

    // Verificar servicios
    const serviceCount = await prisma.service.count();
    console.log(`\n🔧 Servicios existentes: ${serviceCount}`);

    if (serviceCount === 0) {
      console.log('⚠️  No hay servicios. Creando servicios de ejemplo...\n');
      
      const sampleServices = [
        {
          name: "Mantenimiento de PC",
          description: "Servicio completo de mantenimiento y limpieza de computadoras",
          price: 49.99,
          investment: 20.00,
          active: true
        },
        {
          name: "Instalación de Software",
          description: "Instalación y configuración de software y programas",
          price: 29.99,
          investment: 10.00,
          active: true
        },
        {
          name: "Reparación de Hardware",
          description: "Diagnóstico y reparación de problemas de hardware",
          price: 79.99,
          investment: 30.00,
          active: true
        }
      ];

      for (const service of sampleServices) {
        try {
          await prisma.service.create({ data: service });
          console.log(`✅ Creado: ${service.name} - $${service.price}`);
        } catch (error) {
          console.log(`❌ Error creando ${service.name}: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que la base de datos Neon esté activa');
    console.log('   2. Verifica las credenciales en DATABASE_URL');
    console.log('   3. Asegúrate de que el esquema esté sincronizado');
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateProducts().catch(console.error);
