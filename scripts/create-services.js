const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createServices() {
  try {
    console.log('🌱 Creando servicios de IT360 Soluciones...\n');

    const services = [
      {
        name: 'Soporte Técnico y Reparación de PCs',
        description: 'Servicio integral de soporte técnico y reparación de computadoras y notebooks. Incluye optimización del sistema operativo, eliminación de virus, backup y recuperación de datos, instalación de programas y drivers.',
        price: 50.00
      },
      {
        name: 'Redes e Internet',
        description: 'Servicios especializados en configuración de redes WiFi y cableadas. Instalación y optimización de routers, repetidores y puntos de acceso. Solución de problemas de conectividad y velocidad.',
        price: 80.00
      },
      {
        name: 'Desarrollo de Software a Medida',
        description: 'Desarrollo de software personalizado para empresas, comercios o profesionales. Creamos paneles de gestión, administración de turnos, stock, facturación, formularios inteligentes, reportes automáticos y conexión con bases de datos.',
        price: 1500.00
      },
      {
        name: 'Aplicaciones Móviles',
        description: 'Desarrollo de aplicaciones móviles nativas y multiplataforma para Android e iOS. Interfaz amigable y personalizada para tu negocio. Incluye funciones como geolocalización, notificaciones push y acceso por usuario.',
        price: 2500.00
      },
      {
        name: 'Venta de Productos Tecnológicos',
        description: 'Venta de productos tecnológicos seleccionados de marcas reconocidas. Incluye accesorios, periféricos, routers, memorias, discos externos y más. Asesoramiento personalizado para elegir lo mejor para tu necesidad.',
        price: 0.00
      },
      {
        name: 'Ciberseguridad',
        description: 'Servicios de seguridad informática incluyendo auditorías, implementación de políticas de seguridad, protección contra malware y ransomware, configuración de firewalls y antivirus.',
        price: 200.00
      },
      {
        name: 'Consultoría IT',
        description: 'Análisis de necesidades tecnológicas, planificación estratégica de IT, evaluación de infraestructura existente, recomendaciones de mejora y roadmap de implementación.',
        price: 120.00
      },
      {
        name: 'Mantenimiento de Sistemas',
        description: 'Mantenimiento preventivo y correctivo de sistemas informáticos, actualizaciones de software, monitoreo de rendimiento y optimización de recursos.',
        price: 100.00
      },
      {
        name: 'Migración de Datos',
        description: 'Servicios de migración segura de datos entre sistemas, backup y recuperación, transferencia de información empresarial con garantía de integridad.',
        price: 300.00
      },
      {
        name: 'Capacitación Tecnológica',
        description: 'Programas de capacitación personalizados para equipos de trabajo, formación en nuevas tecnologías y herramientas, soporte para adopción de sistemas.',
        price: 80.00
      }
    ];

    let createdCount = 0;
    let errorCount = 0;

    for (const service of services) {
      try {
        // Verificar si el servicio ya existe
        const existingService = await prisma.service.findFirst({
          where: {
            name: service.name
          }
        });

        if (existingService) {
          console.log(`⚠️  Servicio ya existe: ${service.name}`);
          continue;
        }

        await prisma.service.create({
          data: service
        });
        createdCount++;
        console.log(`✅ Creado servicio: ${service.name} - $${service.price}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error creando servicio ${service.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de creación de servicios:');
    console.log(`   ✅ Creados exitosamente: ${createdCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${services.length}`);

    if (createdCount > 0) {
      console.log('\n🎉 Servicios de IT360 creados exitosamente!');
      console.log('💡 Ahora puedes ver los servicios en la página web.');
    }

  } catch (error) {
    console.error('❌ Error durante la creación de servicios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createServices(); 