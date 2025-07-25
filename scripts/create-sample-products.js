#!/usr/bin/env node

/**
 * Script para crear productos de muestra
 * Genera productos de diferentes categorías para probar el sistema
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Monitor LED 24\" Samsung",
    description: "Monitor LED de 24 pulgadas, resolución Full HD 1920x1080, tiempo de respuesta 5ms, ideal para gaming y trabajo",
    price: 45000,
    stock: 15,
    category: "Monitores",
    image: "/servicio-productos.png"
  },
  {
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico con switches Cherry MX Red, iluminación RGB personalizable, ideal para gaming y programación",
    price: 25000,
    stock: 25,
    category: "Periféricos",
    image: "/servicio-productos.png"
  },
  {
    name: "Mouse Gaming Logitech",
    description: "Mouse gaming con sensor óptico de alta precisión, 6 botones programables, DPI ajustable hasta 16000",
    price: 18000,
    stock: 30,
    category: "Periféricos",
    image: "/servicio-productos.png"
  },
  {
    name: "SSD 500GB Kingston",
    description: "Disco sólido interno de 500GB, velocidad de lectura hasta 3500MB/s, ideal para mejorar el rendimiento del sistema",
    price: 35000,
    stock: 20,
    category: "Almacenamiento",
    image: "/servicio-productos.png"
  },
  {
    name: "Memoria RAM 16GB DDR4",
    description: "Módulo de memoria RAM DDR4 de 16GB, velocidad 3200MHz, compatible con la mayoría de placas base modernas",
    price: 28000,
    stock: 18,
    category: "Memoria",
    image: "/servicio-productos.png"
  },
  {
    name: "Webcam HD 1080p",
    description: "Cámara web HD con resolución 1080p, micrófono integrado, ideal para videoconferencias y streaming",
    price: 15000,
    stock: 22,
    category: "Accesorios",
    image: "/servicio-productos.png"
  },
  {
    name: "Auriculares Gaming",
    description: "Auriculares gaming con sonido envolvente 7.1, micrófono con cancelación de ruido, cómodos para largas sesiones",
    price: 22000,
    stock: 12,
    category: "Audio",
    image: "/servicio-productos.png"
  },
  {
    name: "Fuente de Poder 650W",
    description: "Fuente de poder certificada 80 Plus Bronze, 650W, modular, ideal para sistemas gaming de gama media",
    price: 32000,
    stock: 8,
    category: "Componentes",
    image: "/servicio-productos.png"
  },
  {
    name: "Placa de Video GTX 1660",
    description: "Tarjeta gráfica NVIDIA GTX 1660 6GB GDDR5, ideal para gaming en 1080p y edición de video",
    price: 120000,
    stock: 5,
    category: "Gráficas",
    image: "/servicio-productos.png"
  },
  {
    name: "Impresora Láser Multifunción",
    description: "Impresora láser multifunción, impresión, escaneo y copiado, conectividad WiFi, ideal para oficina",
    price: 85000,
    stock: 10,
    category: "Impresoras",
    image: "/servicio-productos.png"
  }
];

const sampleServices = [
  {
    name: "Mantenimiento de PC",
    description: "Servicio completo de mantenimiento preventivo y correctivo para computadoras de escritorio y notebooks",
    price: 8000
  },
  {
    name: "Instalación de Software",
    description: "Instalación y configuración de software de oficina, antivirus, drivers y programas especializados",
    price: 5000
  },
  {
    name: "Recuperación de Datos",
    description: "Servicio de recuperación de datos perdidos por fallas de hardware, virus o eliminación accidental",
    price: 15000
  },
  {
    name: "Armado de PC",
    description: "Armado completo de computadora personalizada según tus necesidades, con garantía y soporte",
    price: 12000
  },
  {
    name: "Configuración de Red",
    description: "Instalación y configuración de redes WiFi, cableado estructurado y equipos de red",
    price: 10000
  }
];

async function createSampleData() {
  try {
    console.log('🌱 Creando datos de muestra...\n');

    // Crear productos
    console.log('📦 Creando productos de muestra...');
    for (const product of sampleProducts) {
      await prisma.product.create({
        data: {
          ...product,
          active: true
        }
      });
      console.log(`   ✅ ${product.name}`);
    }

    // Crear servicios
    console.log('\n🔧 Creando servicios de muestra...');
    for (const service of sampleServices) {
      await prisma.service.create({
        data: service
      });
      console.log(`   ✅ ${service.name}`);
    }

    // Mostrar estadísticas
    const productCount = await prisma.product.count();
    const serviceCount = await prisma.service.count();

    console.log('\n🎉 ¡Datos de muestra creados exitosamente!');
    console.log('📊 Estadísticas:');
    console.log(`   📦 Productos: ${productCount}`);
    console.log(`   🔧 Servicios: ${serviceCount}`);

    // Mostrar algunos productos creados
    console.log('\n📋 Productos disponibles:');
    const products = await prisma.product.findMany({
      select: { name: true, price: true, stock: true, category: true }
    });

    products.forEach(product => {
      console.log(`   • ${product.name} - $${product.price.toLocaleString()} (${product.stock} en stock) - ${product.category}`);
    });

    console.log('\n🚀 El sistema está listo para usar!');
    console.log('💡 Puedes acceder a:');
    console.log('   • /admin - Panel de administración');
    console.log('   • /admin/products - Gestión de productos');
    console.log('   • /admin/services - Gestión de servicios');
    console.log('   • /catalogo - Catálogo público');

  } catch (error) {
    console.error('❌ Error creando datos de muestra:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData(); 