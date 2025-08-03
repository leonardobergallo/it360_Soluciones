import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Los 10 servicios originales de IT360
const serviciosOriginales = [
  {
    name: 'Desarrollo Web Corporativo',
    description: 'Sitios web empresariales a medida con diseño responsive y funcionalidades avanzadas',
    price: 2500,
    order: 1
  },
  {
    name: 'Aplicaciones Móviles',
    description: 'Desarrollo de apps nativas e híbridas para iOS y Android',
    price: 3500,
    order: 2
  },
  {
    name: 'Soporte Técnico Integral',
    description: 'Asistencia remota y presencial para empresas, mantenimiento preventivo y correctivo',
    price: 800,
    order: 3
  },
  {
    name: 'Consultoría en Ciberseguridad',
    description: 'Auditoría de seguridad, implementación de protocolos y protección de datos',
    price: 3200,
    order: 4
  },
  {
    name: 'Infraestructura y Redes',
    description: 'Configuración de servidores, redes empresariales y sistemas de respaldo',
    price: 1800,
    order: 5
  },
  {
    name: 'Migración de Datos',
    description: 'Transferencia segura de datos entre sistemas, limpieza y optimización',
    price: 1200,
    order: 6
  },
  {
    name: 'Mantenimiento de Sistemas',
    description: 'Monitoreo continuo, actualizaciones y optimización de rendimiento',
    price: 600,
    order: 7
  },
  {
    name: 'Hogar Inteligente',
    description: 'Automatización domótica, control de iluminación, seguridad y entretenimiento',
    price: 2800,
    order: 8
  },
  {
    name: 'E-commerce y Tiendas Online',
    description: 'Plataformas de comercio electrónico completas con pasarelas de pago',
    price: 2200,
    order: 9
  },
  {
    name: 'Marketing Digital',
    description: 'SEO, SEM, redes sociales y estrategias de posicionamiento online',
    price: 1500,
    order: 10
  }
];

async function restoreServices() {
  console.log('🔧 RESTAURANDO LOS 10 SERVICIOS ORIGINALES');
  console.log('='.repeat(60));

  try {
    // 1. Limpiar servicios existentes
    console.log('\n🗑️ 1. Limpiando servicios existentes...');
    await prisma.service.deleteMany({});
    console.log('✅ Servicios existentes eliminados');

    // 2. Crear los 10 servicios originales
    console.log('\n➕ 2. Creando los 10 servicios originales...');
    
    for (const servicio of serviciosOriginales) {
      await prisma.service.create({
        data: {
          name: servicio.name,
          description: servicio.description,
          price: servicio.price,
          order: servicio.order,
          active: true
        }
      });
      
      console.log(`✅ Creado: ${servicio.name} - $${servicio.price}`);
    }

    // 3. Verificar que se crearon correctamente
    console.log('\n📊 3. Verificando servicios creados...');
    const serviciosCreados = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });

    console.log(`✅ Total de servicios creados: ${serviciosCreados.length}`);
    
    console.log('\n📋 Lista completa de servicios:');
    serviciosCreados.forEach((servicio, index) => {
      console.log(`${index + 1}. ${servicio.name} - $${servicio.price}`);
    });

    // 4. Estadísticas
    const precioTotal = serviciosCreados.reduce((sum, s) => sum + s.price, 0);
    const precioPromedio = precioTotal / serviciosCreados.length;
    const precioMin = Math.min(...serviciosCreados.map(s => s.price));
    const precioMax = Math.max(...serviciosCreados.map(s => s.price));

    console.log('\n📈 Estadísticas:');
    console.log(`   • Precio total: $${precioTotal.toLocaleString()}`);
    console.log(`   • Precio promedio: $${precioPromedio.toFixed(2)}`);
    console.log(`   • Precio mínimo: $${precioMin}`);
    console.log(`   • Precio máximo: $${precioMax}`);

    console.log('\n✅ SERVICIOS RESTAURADOS EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('🌐 Para ver los servicios en la web:');
    console.log('   • Ve a: http://localhost:3001');
    console.log('   • O ejecuta: npm run dev');

  } catch (error) {
    console.error('❌ Error restaurando servicios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la restauración
restoreServices(); 