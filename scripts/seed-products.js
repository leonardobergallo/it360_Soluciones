const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productos = [
  {
    nombre: "Imiki by Imilab ST2 1.96\" TFT Función Llamada IP68 Azul",
    descripcion: "Reloj inteligente con pantalla TFT de 1.96\", función de llamada, resistencia IP68, color azul",
    precio: 53300,
    stock: 10,
    categoria: "Electrónicos",
    imagen: "/images/imiki-st2.jpg",
    activo: true
  },
  {
    nombre: "iPhone 15 Pro Max 256GB",
    descripcion: "Smartphone Apple con chip A17 Pro, cámara triple, 256GB de almacenamiento",
    precio: 1500000,
    stock: 5,
    categoria: "Smartphones",
    imagen: "/images/iphone-15-pro.jpg",
    activo: true
  },
  {
    nombre: "Samsung Galaxy S24 Ultra",
    descripcion: "Smartphone Samsung con S Pen, cámara de 200MP, 512GB de almacenamiento",
    precio: 1200000,
    stock: 8,
    categoria: "Smartphones",
    imagen: "/images/samsung-s24.jpg",
    activo: true
  },
  {
    nombre: "MacBook Pro 14\" M3 Pro",
    descripcion: "Laptop Apple con chip M3 Pro, 14 pulgadas, 16GB RAM, 512GB SSD",
    precio: 2500000,
    stock: 3,
    categoria: "Computadoras",
    imagen: "/images/macbook-pro.jpg",
    activo: true
  },
  {
    nombre: "AirPods Pro 2da Generación",
    descripcion: "Auriculares inalámbricos con cancelación de ruido activa y audio espacial",
    precio: 250000,
    stock: 15,
    categoria: "Audio",
    imagen: "/images/airpods-pro.jpg",
    activo: true
  },
  {
    nombre: "iPad Air 5ta Generación",
    descripcion: "Tablet Apple con chip M1, 10.9 pulgadas, 64GB de almacenamiento",
    precio: 800000,
    stock: 7,
    categoria: "Tablets",
    imagen: "/images/ipad-air.jpg",
    activo: true
  },
  {
    nombre: "Nintendo Switch OLED",
    descripcion: "Consola de videojuegos con pantalla OLED de 7 pulgadas",
    precio: 400000,
    stock: 12,
    categoria: "Gaming",
    imagen: "/images/nintendo-switch.jpg",
    activo: true
  },
  {
    nombre: "Sony WH-1000XM5",
    descripcion: "Auriculares over-ear con cancelación de ruido líder en la industria",
    precio: 350000,
    stock: 6,
    categoria: "Audio",
    imagen: "/images/sony-wh1000xm5.jpg",
    activo: true
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Iniciando seed de productos...');
    
    // Limpiar productos existentes
    await prisma.product.deleteMany();
    console.log('🗑️ Productos existentes eliminados');
    
    // Agregar nuevos productos
    for (const producto of productos) {
      await prisma.product.create({
        data: producto
      });
    }
    
    console.log(`✅ ${productos.length} productos agregados exitosamente`);
    
    // Verificar productos
    const count = await prisma.product.count();
    console.log(`📊 Total de productos en la base de datos: ${count}`);
    
  } catch (error) {
    console.error('❌ Error al agregar productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts(); 