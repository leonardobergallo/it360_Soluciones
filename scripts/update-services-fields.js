const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateServicesFields() {
  try {
    console.log('🔄 Actualizando servicios con nuevos campos...\n');

    // Obtener todos los servicios
    const services = await prisma.service.findMany();
    console.log(`📋 Encontrados ${services.length} servicios para actualizar`);

    let updatedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      try {
        await prisma.service.update({
          where: { id: service.id },
          data: {
            active: true, // Por defecto todos activos
            order: i + 1  // Orden secuencial
          }
        });
        updatedCount++;
        console.log(`✅ Actualizado: ${service.name} (orden: ${i + 1})`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error actualizando ${service.name}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de actualización:');
    console.log(`   ✅ Actualizados exitosamente: ${updatedCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${services.length}`);

    if (updatedCount > 0) {
      console.log('\n🎉 Servicios actualizados exitosamente!');
      console.log('💡 Ahora puedes usar las nuevas funcionalidades de orden y visibilidad.');
    }

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServicesFields(); 