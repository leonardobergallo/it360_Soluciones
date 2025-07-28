const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateServicesInvestment() {
  try {
    console.log('💼 Actualizando servicios con información de inversión y beneficios...\n');

    const servicesToUpdate = [
      {
        name: 'Desarrollo de Software',
        description: 'Aplicaciones web y de escritorio personalizadas. Automatización de procesos empresariales.',
        price: 150000,
        descripcionLarga: 'Desarrollamos software a medida que optimiza tus operaciones. Incluye análisis de requerimientos, desarrollo, testing y mantenimiento. ROI esperado: 400% en 18 meses.'
      },
      {
        name: 'Desarrollo de Apps Móviles',
        description: 'Apps nativas iOS y Android. Interfaz intuitiva y funcionalidades avanzadas.',
        price: 200000,
        descripcionLarga: 'Creamos apps móviles que conectan con tus clientes 24/7. Incluye diseño UX/UI, desarrollo nativo, publicación en stores y actualizaciones. Incremento de ventas: 250%.'
      },
      {
        name: 'Instalación y Mantenimiento de Redes',
        description: 'Configuración de redes empresariales. Seguridad y optimización de conectividad.',
        price: 80000,
        descripcionLarga: 'Implementamos redes seguras y escalables. Incluye cableado estructurado, equipos de red, configuración de seguridad y monitoreo 24/7. Reducción de costos: 35%.'
      },
      {
        name: 'Mantenimiento de PC y Servidores',
        description: 'Mantenimiento preventivo y correctivo. Optimización de rendimiento y seguridad.',
        price: 60000,
        descripcionLarga: 'Mantenemos tu infraestructura IT funcionando al 100%. Incluye limpieza, actualizaciones, backups y soporte técnico. Aumento de productividad: 40%.'
      },
      {
        name: 'Consultoría IT',
        description: 'Asesoramiento estratégico en tecnología. Planificación de transformación digital.',
        price: 120000,
        descripcionLarga: 'Te ayudamos a tomar las mejores decisiones tecnológicas. Incluye auditoría IT, planificación estratégica y roadmap de implementación. Optimización de costos: 50%.'
      }
    ];

    let updatedCount = 0;
    let createdCount = 0;
    let errorCount = 0;

    for (const service of servicesToUpdate) {
      try {
        // Buscar si el servicio ya existe
        const existingService = await prisma.service.findFirst({
          where: {
            name: service.name
          }
        });

        if (existingService) {
          // Actualizar servicio existente
          await prisma.service.update({
            where: { id: existingService.id },
            data: {
              description: service.description,
              price: service.price,
              descripcionLarga: service.descripcionLarga
            }
          });
          updatedCount++;
          console.log(`✅ Actualizado servicio: ${service.name} - $${service.price.toLocaleString()}`);
        } else {
          // Crear nuevo servicio
          await prisma.service.create({
            data: {
              name: service.name,
              description: service.description,
              price: service.price,
              descripcionLarga: service.descripcionLarga,
              active: true,
              order: createdCount + updatedCount
            }
          });
          createdCount++;
          console.log(`🆕 Creado servicio: ${service.name} - $${service.price.toLocaleString()}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error procesando servicio ${service.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de actualización de servicios:');
    console.log(`   ✅ Actualizados: ${updatedCount}`);
    console.log(`   🆕 Creados: ${createdCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${servicesToUpdate.length}`);

    if (updatedCount > 0 || createdCount > 0) {
      console.log('\n🎉 Servicios actualizados exitosamente!');
      console.log('💡 Ahora los servicios muestran información clara sobre inversión y beneficios.');
      console.log('📈 Cada servicio incluye ROI esperado y métricas de mejora.');
    }

  } catch (error) {
    console.error('❌ Error durante la actualización de servicios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServicesInvestment(); 