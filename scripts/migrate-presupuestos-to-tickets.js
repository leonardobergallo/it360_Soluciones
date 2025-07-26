const { PrismaClient } = require('@prisma/client');

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

async function migratePresupuestosToTickets() {
  try {
    console.log('🔄 Iniciando migración de presupuestos a tickets...\n');
    
    // Verificar si hay presupuestos para migrar
    const presupuestos = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='Presupuesto'
    `;
    
    if (presupuestos.length === 0) {
      console.log('ℹ️ No se encontró la tabla Presupuesto. No hay datos para migrar.');
      return;
    }

    // Obtener todos los presupuestos
    const presupuestosData = await prisma.$queryRaw`
      SELECT * FROM Presupuesto
    `;

    if (presupuestosData.length === 0) {
      console.log('ℹ️ No hay presupuestos para migrar.');
      return;
    }

    console.log(`📋 Encontrados ${presupuestosData.length} presupuestos para migrar.\n`);

    let migratedCount = 0;
    let errorCount = 0;

    // Migrar cada presupuesto a un ticket
    for (const presupuesto of presupuestosData) {
      try {
        // Generar número de ticket único
        const ticketNumber = `PRES-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        
        // Crear el ticket
        await prisma.ticket.create({
          data: {
            ticketNumber: ticketNumber,
            nombre: presupuesto.nombre,
            email: presupuesto.email,
            telefono: presupuesto.telefono,
            empresa: presupuesto.empresa,
            servicio: presupuesto.servicio,
            mensaje: presupuesto.mensaje,
            tipo: 'presupuesto',
            categoria: 'solicitud',
            asunto: `Presupuesto: ${presupuesto.servicio}`,
            descripcion: presupuesto.mensaje || `Solicitud de presupuesto para: ${presupuesto.servicio}`,
            urgencia: 'normal',
            estado: presupuesto.estado === 'pendiente' ? 'abierto' : presupuesto.estado,
            prioridad: 'media',
            createdAt: presupuesto.createdAt,
            updatedAt: presupuesto.updatedAt
          }
        });

        migratedCount++;
        console.log(`✅ Migrado presupuesto: ${presupuesto.nombre} -> Ticket: ${ticketNumber}`);

      } catch (error) {
        errorCount++;
        console.error(`❌ Error migrando presupuesto ${presupuesto.nombre}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de migración:');
    console.log(`   ✅ Migrados exitosamente: ${migratedCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📋 Total procesados: ${presupuestosData.length}`);

    if (migratedCount > 0) {
      console.log('\n🎉 Migración completada exitosamente!');
      console.log('💡 Ahora puedes eliminar la tabla Presupuesto si lo deseas.');
    }

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    // Cerrar la conexión de Prisma
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migratePresupuestosToTickets(); 