const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Datos de productos corregidos (precios en formato normal, no notación científica)
const productos = [
  {
    name: "APPLE iPhone 15 Pro",
    description: "iPhone 15 Pro 128GB - Smartphone Apple con cámara profesional",
    price: 715000,
    basePrice: 650000,
    markup: 10,
    stock: 10,
    category: "Celulares",
    image: "/icono.png",
    active: true
  },
  {
    name: "Auricular Bluetooth",
    description: "Auricular inalámbrico con cancelación de ruido",
    price: 14200,
    basePrice: 13000,
    markup: 9,
    stock: 10,
    category: "Accesorio",
    image: "/icono.png",
    active: true
  },
  {
    name: "BROTHER Impresora Láser",
    description: "Impresora láser monocromática Brother HL-L2350DW",
    price: 91000,
    basePrice: 85000,
    markup: 7,
    stock: 10,
    category: "Impresora",
    image: "/icono.png",
    active: true
  },
  {
    name: "Cámara Web HD",
    description: "Cámara web Full HD 1080p para videoconferencias",
    price: 34400,
    basePrice: 32000,
    markup: 7.5,
    stock: 10,
    category: "Periferico",
    image: "/icono.png",
    active: true
  },
  {
    name: "Monitor Gaming 24\"",
    description: "Monitor gaming 24 pulgadas 144Hz Full HD",
    price: 208000,
    basePrice: 190000,
    markup: 9.5,
    stock: 10,
    category: "Monitores",
    image: "/icono.png",
    active: true
  },
  {
    name: "MOTOROLA Moto G84",
    description: "Motorola Moto G84 128GB - Smartphone Android",
    price: 61755,
    basePrice: 56000,
    markup: 10.3,
    stock: 10,
    category: "Celulares",
    image: "/icono.png",
    active: true
  },
  {
    name: "SANDISK SSD 500GB",
    description: "Disco sólido interno SANDISK 500GB SATA III",
    price: 88653,
    basePrice: 80000,
    markup: 10.8,
    stock: 10,
    category: "Almacena",
    image: "/icono.png",
    active: true
  },
  {
    name: "SEAGATE HDD 1TB",
    description: "Disco duro interno SEAGATE 1TB 7200RPM",
    price: 367328,
    basePrice: 330000,
    markup: 11.3,
    stock: 10,
    category: "Almacena",
    image: "/icono.png",
    active: true
  },
  {
    name: "Tablet Samsung Galaxy",
    description: "Tablet Samsung Galaxy Tab A8 10.5\" 64GB",
    price: 156000,
    basePrice: 140000,
    markup: 11.4,
    stock: 10,
    category: "Tablets",
    image: "/icono.png",
    active: true
  },
  {
    name: "XTECH Parlante Bluetooth",
    description: "Parlante portátil XTECH con conectividad Bluetooth",
    price: 45000,
    basePrice: 40000,
    markup: 12.5,
    stock: 10,
    category: "Parlantes",
    image: "/icono.png",
    active: true
  },
  {
    name: "Notebook HP Pavilion",
    description: "Notebook HP Pavilion 15.6\" Intel i5 8GB RAM",
    price: 450000,
    basePrice: 400000,
    markup: 12.5,
    stock: 10,
    category: "Notebook",
    image: "/icono.png",
    active: true
  },
  {
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico gaming con retroiluminación RGB",
    price: 28000,
    basePrice: 25000,
    markup: 12,
    stock: 10,
    category: "Periferico",
    image: "/icono.png",
    active: true
  },
  {
    name: "Mouse Gaming Logitech",
    description: "Mouse gaming Logitech G502 con sensor óptico",
    price: 32000,
    basePrice: 29000,
    markup: 10.3,
    stock: 10,
    category: "Periferico",
    image: "/icono.png",
    active: true
  },
  {
    name: "Samsung Galaxy S24",
    description: "Samsung Galaxy S24 128GB - Smartphone Android",
    price: 680000,
    basePrice: 620000,
    markup: 9.7,
    stock: 10,
    category: "Celulares",
    image: "/icono.png",
    active: true
  },
  {
    name: "Monitor Dell 27\" 4K",
    description: "Monitor Dell 27 pulgadas resolución 4K UHD",
    price: 320000,
    basePrice: 290000,
    markup: 10.3,
    stock: 10,
    category: "Monitores",
    image: "/icono.png",
    active: true
  }
];

async function importarProductos() {
  try {
    console.log('🚀 Iniciando importación de productos...');
    console.log(`📦 Total de productos a importar: ${productos.length}`);

    // Limpiar productos existentes (opcional - comentar si no quieres)
    // await prisma.product.deleteMany({});
    // console.log('🗑️ Productos existentes eliminados');

    let creados = 0;
    let actualizados = 0;

    for (const producto of productos) {
      try {
        // Verificar si el producto ya existe
        const productoExistente = await prisma.product.findFirst({
          where: {
            name: producto.name
          }
        });

        if (productoExistente) {
          // Actualizar producto existente
          await prisma.product.update({
            where: { id: productoExistente.id },
            data: {
              description: producto.description,
              price: producto.price,
              basePrice: producto.basePrice,
              markup: producto.markup,
              stock: producto.stock,
              category: producto.category,
              image: producto.image,
              active: producto.active
            }
          });
          actualizados++;
          console.log(`✅ Actualizado: ${producto.name}`);
        } else {
          // Crear nuevo producto
          await prisma.product.create({
            data: producto
          });
          creados++;
          console.log(`🆕 Creado: ${producto.name} - $${producto.price.toLocaleString()}`);
        }
      } catch (error) {
        console.error(`❌ Error con ${producto.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de importación:');
    console.log(`✅ Productos creados: ${creados}`);
    console.log(`🔄 Productos actualizados: ${actualizados}`);
    console.log(`📦 Total procesados: ${creados + actualizados}`);

    // Mostrar productos importados
    const productosImportados = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    console.log('\n🎯 Últimos productos en la base de datos:');
    productosImportados.forEach(p => {
      console.log(`  • ${p.name} - $${p.price?.toLocaleString() || '0'} (Stock: ${p.stock})`);
    });

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
importarProductos(); 