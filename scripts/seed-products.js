const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const products = [
  {
    name: "Monitor LED 24 pulgadas",
    description: "Monitor LED de 24 pulgadas, resolución Full HD 1920x1080, tiempo de respuesta 5ms, conectores HDMI y VGA.",
    price: 45000,
    basePrice: 40000,
    markup: 12.5,
    stock: 10,
    category: "Monitores",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    active: true
  },
  {
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico con switches azules, retroiluminación RGB, diseño gaming, conexión USB.",
    price: 15000,
    basePrice: 12000,
    markup: 25,
    stock: 25,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    active: true
  },
  {
    name: "Mouse Inalámbrico",
    description: "Mouse inalámbrico óptico, 1600 DPI, batería recargable, diseño ergonómico, conexión USB.",
    price: 8000,
    basePrice: 6000,
    markup: 33.3,
    stock: 30,
    category: "Periféricos",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    active: true
  },
  {
    name: "Router WiFi 6",
    description: "Router WiFi 6 de doble banda, velocidad hasta 1.8 Gbps, 4 puertos LAN, antenas externas.",
    price: 35000,
    basePrice: 28000,
    markup: 25,
    stock: 15,
    category: "Redes",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    active: true
  },
  {
    name: "Disco Externo 1TB",
    description: "Disco duro externo USB 3.0, capacidad 1TB, velocidad 5400 RPM, compatible con PC y Mac.",
    price: 18000,
    basePrice: 15000,
    markup: 20,
    stock: 20,
    category: "Almacenamiento",
    image: "https://images.unsplash.com/photo-1597872200964-2b65d56bd16b?w=400&h=300&fit=crop",
    active: true
  },
  {
    name: "Memoria RAM 8GB DDR4",
    description: "Memoria RAM DDR4 de 8GB, velocidad 2666 MHz, compatible con la mayoría de placas madre.",
    price: 12000,
    basePrice: 10000,
    markup: 20,
    stock: 40,
    category: "Memoria",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop",
    active: true
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Iniciando seed de productos...');
    
    // Verificar si ya existen productos
    const existingProducts = await prisma.product.count();
    if (existingProducts > 0) {
      console.log(`📦 Ya existen ${existingProducts} productos en la base de datos`);
      console.log('⚠️ No se eliminarán productos existentes para evitar conflictos de claves foráneas');
    }
    
    // Insertar nuevos productos (solo si no existen)
    for (const product of products) {
      try {
        await prisma.product.create({
          data: product
        });
        console.log(`✅ Producto creado: ${product.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Producto ya existe: ${product.name}`);
        } else {
          console.error(`❌ Error creando producto ${product.name}:`, error.message);
        }
      }
    }
    
    console.log(`🎉 ${products.length} productos creados exitosamente`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();