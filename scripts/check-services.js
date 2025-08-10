const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndCreateServices() {
  try {
    console.log('🔍 Verificando servicios en la base de datos...\n');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos\n');

    // Verificar si existen servicios
    const existingServices = await prisma.service.findMany();
    console.log(`📦 Servicios encontrados: ${existingServices.length}\n`);

    if (existingServices.length === 0) {
      console.log('⚠️  No hay servicios en la base de datos');
      console.log('📝 Creando servicios por defecto...\n');

      const defaultServices = [
        {
          name: 'Desarrollo Web',
          description: 'Sitios web profesionales y aplicaciones web modernas',
          price: 50000,
          active: true,
          order: 1,
          descripcionLarga: 'Desarrollo de sitios web profesionales, aplicaciones web modernas y sistemas de gestión. Utilizamos las últimas tecnologías para crear soluciones escalables y eficientes.',
          imagen: '/servicio-apps.png'
        },
        {
          name: 'Soporte Técnico',
          description: 'Mantenimiento y soporte técnico para equipos informáticos',
          price: 15000,
          active: true,
          order: 2,
          descripcionLarga: 'Servicio completo de soporte técnico para equipos informáticos, mantenimiento preventivo, reparación de hardware y software, y asistencia remota.',
          imagen: '/servicio-pc.png'
        },
        {
          name: 'Redes y Conectividad',
          description: 'Configuración y mantenimiento de redes empresariales',
          price: 25000,
          active: true,
          order: 3,
          descripcionLarga: 'Configuración, instalación y mantenimiento de redes empresariales, WiFi, cableado estructurado y soluciones de conectividad.',
          imagen: '/servicio-redes.png'
        },
        {
          name: 'Software a Medida',
          description: 'Desarrollo de software personalizado para tu negocio',
          price: 75000,
          active: true,
          order: 4,
          descripcionLarga: 'Desarrollo de software personalizado adaptado a las necesidades específicas de tu empresa. Sistemas de gestión, aplicaciones móviles y más.',
          imagen: '/servicio-software.png'
        },
        {
          name: 'Productos Tecnológicos',
          description: 'Venta de insumos y productos tecnológicos',
          price: 0,
          active: true,
          order: 5,
          descripcionLarga: 'Amplio catálogo de productos tecnológicos: computadoras, periféricos, componentes, accesorios y más. Productos de calidad con garantía.',
          imagen: '/servicio-productos.png'
        }
      ];

      // Crear servicios
      for (const service of defaultServices) {
        const createdService = await prisma.service.create({
          data: service
        });
        console.log(`✅ Creado: ${createdService.name} - $${createdService.price}`);
      }

      console.log('\n🎉 Servicios creados exitosamente!');
    } else {
      console.log('📋 Servicios existentes:');
      existingServices.forEach(service => {
        console.log(`   • ${service.name} - $${service.price} - ${service.active ? '✅ Activo' : '❌ Inactivo'}`);
      });
    }

    // Verificar estructura de la tabla
    console.log('\n🔧 Verificando estructura de la tabla...');
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'service' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📊 Estructura de la tabla Service:');
    tableInfo.forEach(col => {
      console.log(`   • ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    
    if (error.code === 'P2021') {
      console.log('\n💡 La tabla "service" no existe. Ejecuta:');
      console.log('   npx prisma migrate dev');
    } else if (error.code === 'P1001') {
      console.log('\n💡 Error de conexión a la base de datos. Verifica:');
      console.log('   1. DATABASE_URL en .env.local');
      console.log('   2. Conexión a la base de datos');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCreateServices();
