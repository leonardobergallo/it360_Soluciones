const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Datos completos de 30 productos con imágenes automáticas
const productos = [
  {
    name: "APPLE iPhone 15 Pro",
    description: "iPhone 15 Pro 128GB - Smartphone Apple con cámara profesional y chip A17 Pro",
    price: 715000,
    basePrice: 650000,
    markup: 10,
    stock: 10,
    category: "Celulares",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Samsung Galaxy S24 Ultra 256GB - Smartphone Android con S Pen integrado",
    price: 850000,
    basePrice: 780000,
    markup: 9,
    stock: 8,
    category: "Celulares",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "MOTOROLA Moto G84",
    description: "Motorola Moto G84 128GB - Smartphone Android con cámara de 50MP",
    price: 61755,
    basePrice: 56000,
    markup: 10.3,
    stock: 15,
    category: "Celulares",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Xiaomi Redmi Note 13",
    description: "Xiaomi Redmi Note 13 128GB - Smartphone con pantalla AMOLED 6.67\"",
    price: 450000,
    basePrice: 410000,
    markup: 9.8,
    stock: 12,
    category: "Celulares",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Notebook HP Pavilion",
    description: "Notebook HP Pavilion 15.6\" Intel i5 8GB RAM 512GB SSD",
    price: 450000,
    basePrice: 400000,
    markup: 12.5,
    stock: 6,
    category: "Notebook",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "MacBook Air M2",
    description: "MacBook Air 13\" con chip M2, 8GB RAM, 256GB SSD",
    price: 1200000,
    basePrice: 1100000,
    markup: 9.1,
    stock: 4,
    category: "Notebook",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Dell Inspiron 15",
    description: "Dell Inspiron 15 3000 Intel i3 8GB RAM 1TB HDD",
    price: 380000,
    basePrice: 350000,
    markup: 8.6,
    stock: 8,
    category: "Notebook",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Lenovo ThinkPad E14",
    description: "Lenovo ThinkPad E14 AMD Ryzen 5 8GB RAM 256GB SSD",
    price: 520000,
    basePrice: 480000,
    markup: 8.3,
    stock: 5,
    category: "Notebook",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Monitor Gaming 24\"",
    description: "Monitor gaming 24 pulgadas 144Hz Full HD 1ms",
    price: 208000,
    basePrice: 190000,
    markup: 9.5,
    stock: 10,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Monitor Dell 27\" 4K",
    description: "Monitor Dell 27 pulgadas resolución 4K UHD IPS",
    price: 320000,
    basePrice: 290000,
    markup: 10.3,
    stock: 6,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Samsung Monitor 32\" Curvo",
    description: "Monitor Samsung 32\" Curvo 1440p 144Hz Gaming",
    price: 280000,
    basePrice: 255000,
    markup: 9.8,
    stock: 7,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "LG Monitor 34\" Ultrawide",
    description: "Monitor LG 34\" Ultrawide 21:9 1440p IPS",
    price: 450000,
    basePrice: 410000,
    markup: 9.8,
    stock: 4,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "BROTHER Impresora Láser",
    description: "Impresora láser monocromática Brother HL-L2350DW WiFi",
    price: 91000,
    basePrice: 85000,
    markup: 7,
    stock: 12,
    category: "Impresora",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "HP Impresora Multifunción",
    description: "HP DeskJet 2720e Impresora Multifunción WiFi",
    price: 65000,
    basePrice: 60000,
    markup: 8.3,
    stock: 15,
    category: "Impresora",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Canon Impresora Láser Color",
    description: "Canon LBP612Cdw Impresora Láser Color WiFi",
    price: 180000,
    basePrice: 165000,
    markup: 9.1,
    stock: 8,
    category: "Impresora",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "SANDISK SSD 500GB",
    description: "Disco sólido interno SANDISK 500GB SATA III 2.5\"",
    price: 88653,
    basePrice: 80000,
    markup: 10.8,
    stock: 20,
    category: "Almacena",
    image: "https://images.unsplash.com/photo-1597872200969-74b54bb96c53?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "SEAGATE HDD 1TB",
    description: "Disco duro interno SEAGATE 1TB 7200RPM SATA III",
    price: 367328,
    basePrice: 330000,
    markup: 11.3,
    stock: 25,
    category: "Almacena",
    image: "https://images.unsplash.com/photo-1597872200969-74b54bb96c53?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "WD SSD NVMe 1TB",
    description: "Western Digital SSD NVMe 1TB M.2 PCIe Gen4",
    price: 120000,
    basePrice: 110000,
    markup: 9.1,
    stock: 15,
    category: "Almacena",
    image: "https://images.unsplash.com/photo-1597872200969-74b54bb96c53?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Tablet Samsung Galaxy",
    description: "Tablet Samsung Galaxy Tab A8 10.5\" 64GB WiFi",
    price: 156000,
    basePrice: 140000,
    markup: 11.4,
    stock: 10,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "iPad 10th Generation",
    description: "iPad 10th Generation 64GB WiFi 10.9\" Retina",
    price: 450000,
    basePrice: 410000,
    markup: 9.8,
    stock: 6,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Auricular Bluetooth",
    description: "Auricular inalámbrico con cancelación de ruido activa",
    price: 14200,
    basePrice: 13000,
    markup: 9,
    stock: 30,
    category: "Accesorio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico gaming con retroiluminación RGB Cherry MX",
    price: 28000,
    basePrice: 25000,
    markup: 12,
    stock: 18,
    category: "Periferico",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Mouse Gaming Logitech",
    description: "Mouse gaming Logitech G502 con sensor óptico HERO 25K",
    price: 32000,
    basePrice: 29000,
    markup: 10.3,
    stock: 22,
    category: "Periferico",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Cámara Web HD",
    description: "Cámara web Full HD 1080p para videoconferencias",
    price: 34400,
    basePrice: 32000,
    markup: 7.5,
    stock: 25,
    category: "Periferico",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "XTECH Parlante Bluetooth",
    description: "Parlante portátil XTECH con conectividad Bluetooth 5.0",
    price: 45000,
    basePrice: 40000,
    markup: 12.5,
    stock: 15,
    category: "Parlantes",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "JBL Flip 6",
    description: "Parlante portátil JBL Flip 6 Bluetooth resistente al agua",
    price: 85000,
    basePrice: 78000,
    markup: 9,
    stock: 12,
    category: "Parlantes",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Sony WH-1000XM4",
    description: "Auriculares Sony WH-1000XM4 con cancelación de ruido",
    price: 280000,
    basePrice: 255000,
    markup: 9.8,
    stock: 8,
    category: "Accesorio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Apple AirPods Pro",
    description: "AirPods Pro con cancelación de ruido activa y audio espacial",
    price: 320000,
    basePrice: 290000,
    markup: 10.3,
    stock: 10,
    category: "Accesorio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Router WiFi 6",
    description: "Router WiFi 6 TP-Link Archer AX50 con velocidades hasta 3Gbps",
    price: 95000,
    basePrice: 87000,
    markup: 9.2,
    stock: 12,
    category: "Redes",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    active: true
  },
  {
    name: "Switch Gigabit 8 Puertos",
    description: "Switch de red Gigabit 8 puertos para oficina/hogar",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 20,
    category: "Redes",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    active: true
  }
];

async function importarProductosCompletos() {
  try {
    console.log('🚀 Iniciando importación completa de productos...');
    console.log(`📦 Total de productos a importar: ${productos.length}`);

    // PASO 1: Eliminar productos duplicados (mantener solo los últimos)
    console.log('\n🗑️ Eliminando productos duplicados...');
    
    // Obtener todos los productos existentes
    const productosExistentes = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Crear un mapa para identificar duplicados
    const productosUnicos = new Map();
    const productosAEliminar = [];

    productosExistentes.forEach(producto => {
      const clave = producto.name.toLowerCase().trim();
      if (productosUnicos.has(clave)) {
        // Este es un duplicado, marcarlo para eliminar
        productosAEliminar.push(producto.id);
      } else {
        productosUnicos.set(clave, producto.id);
      }
    });

    // Eliminar duplicados
    if (productosAEliminar.length > 0) {
      await prisma.product.deleteMany({
        where: {
          id: { in: productosAEliminar }
        }
      });
      console.log(`✅ Eliminados ${productosAEliminar.length} productos duplicados`);
    } else {
      console.log('✅ No se encontraron productos duplicados');
    }

    // PASO 2: Importar/actualizar productos
    console.log('\n📥 Importando productos...');
    
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

    // PASO 3: Mostrar resumen completo
    console.log('\n📊 Resumen de importación:');
    console.log(`✅ Productos creados: ${creados}`);
    console.log(`🔄 Productos actualizados: ${actualizados}`);
    console.log(`🗑️ Productos duplicados eliminados: ${productosAEliminar.length}`);
    console.log(`📦 Total procesados: ${creados + actualizados}`);

    // PASO 4: Mostrar todos los productos en la base de datos
    const todosLosProductos = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n🎯 Total de productos en la base de datos: ${todosLosProductos.length}`);
    console.log('\n📋 Lista completa de productos:');
    
    todosLosProductos.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name} - $${p.price?.toLocaleString() || '0'} (Stock: ${p.stock}) - ${p.category}`);
    });

    // PASO 5: Mostrar estadísticas por categoría
    const estadisticas = {};
    todosLosProductos.forEach(p => {
      estadisticas[p.category] = (estadisticas[p.category] || 0) + 1;
    });

    console.log('\n📈 Estadísticas por categoría:');
    Object.entries(estadisticas).forEach(([categoria, cantidad]) => {
      console.log(`  • ${categoria}: ${cantidad} productos`);
    });

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
importarProductosCompletos(); 