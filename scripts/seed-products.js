const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const products = [
  {
    name: "Laptop HP Pavilion",
    description: "Laptop de alto rendimiento con procesador Intel i7, 16GB RAM, 512GB SSD. Ideal para trabajo y gaming.",
    price: 899.99,
    stock: 15
  },
  {
    name: "Monitor Samsung 27\"",
    description: "Monitor curvo Full HD con resolución 1920x1080, tiempo de respuesta 1ms, perfecto para gaming y trabajo.",
    price: 299.99,
    stock: 25
  },
  {
    name: "Teclado Mecánico RGB",
    description: "Teclado gaming con switches Cherry MX Blue, iluminación RGB personalizable, teclas anti-ghosting.",
    price: 89.99,
    stock: 30
  },
  {
    name: "Mouse Gaming Logitech",
    description: "Mouse inalámbrico con sensor HERO 25K, 6 botones programables, hasta 25,600 DPI ajustables.",
    price: 79.99,
    stock: 20
  },
  {
    name: "Auriculares Sony WH-1000XM4",
    description: "Auriculares inalámbricos con cancelación de ruido activa, 30 horas de batería, calidad de sonido premium.",
    price: 349.99,
    stock: 12
  },
  {
    name: "Webcam Logitech C920",
    description: "Webcam Full HD 1080p con micrófono integrado, autofocus, perfecta para videoconferencias y streaming.",
    price: 69.99,
    stock: 18
  }
];

const services = [
  {
    name: "Instalación de Software",
    description: "Instalación y configuración de software empresarial, antivirus, y herramientas de productividad.",
    price: 49.99
  },
  {
    name: "Mantenimiento de PC",
    description: "Limpieza física, optimización del sistema, actualización de drivers y diagnóstico completo.",
    price: 39.99
  },
  {
    name: "Configuración de Red",
    description: "Instalación y configuración de routers, switches, puntos de acceso WiFi y seguridad de red.",
    price: 79.99
  },
  {
    name: "Recuperación de Datos",
    description: "Recuperación de archivos eliminados, reparación de discos duros y backup de información importante.",
    price: 99.99
  },
  {
    name: "Desarrollo Web",
    description: "Creación de sitios web profesionales, e-commerce, aplicaciones web y optimización SEO.",
    price: 299.99
  },
  {
    name: "Soporte Técnico Remoto",
    description: "Asistencia técnica remota para resolver problemas de software, configuración y optimización.",
    price: 29.99
  }
];

async function seedData() {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Limpiar datos existentes
    await prisma.sale.deleteMany();
    await prisma.product.deleteMany();
    await prisma.service.deleteMany();

    console.log('🗑️ Datos anteriores eliminados');

    // Crear productos
    for (const product of products) {
      await prisma.product.create({
        data: product
      });
    }
    console.log(`✅ ${products.length} productos creados`);

    // Crear servicios
    for (const service of services) {
      await prisma.service.create({
        data: service
      });
    }
    console.log(`✅ ${services.length} servicios creados`);

    console.log('🎉 Seed completado exitosamente!');
    
    // Mostrar resumen
    const totalProducts = await prisma.product.count();
    const totalServices = await prisma.service.count();
    
    console.log(`\n📊 Resumen:`);
    console.log(`- Productos: ${totalProducts}`);
    console.log(`- Servicios: ${totalServices}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData(); 