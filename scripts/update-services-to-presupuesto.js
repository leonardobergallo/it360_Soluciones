const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateServicesToPresupuesto() {
  try {
    console.log('🔄 Actualizando servicios para manejo de presupuestos...');
    
    // Obtener todos los servicios
    const services = await prisma.service.findMany();
    console.log(`📋 Encontrados ${services.length} servicios`);
    
    // Actualizar cada servicio para establecer precio en 0 (se manejará como presupuesto)
    const updatePromises = services.map(service => 
      prisma.service.update({
        where: { id: service.id },
        data: { 
          price: 0 // Establecer precio en 0 para indicar que es presupuesto
        }
      })
    );
    
    await Promise.all(updatePromises);
    
    console.log('✅ Servicios actualizados exitosamente');
    console.log('📝 Los servicios ahora se manejan como presupuestos personalizados');
    console.log('💡 Los precios se muestran como "Presupuesto" en lugar de valores fijos');
    
    // Mostrar resumen de los servicios actualizados
    const updatedServices = await prisma.service.findMany();
    console.log('\n📊 Resumen de servicios actualizados:');
    updatedServices.forEach(service => {
      console.log(`  • ${service.name}: Presupuesto personalizado`);
    });
    
  } catch (error) {
    console.error('❌ Error actualizando servicios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
updateServicesToPresupuesto(); 