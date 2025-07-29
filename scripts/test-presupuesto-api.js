const { PrismaClient } = require('@prisma/client');

console.log('🧪 Probando API de Presupuestos...\n');

async function testPresupuestoAPI() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');

    // Verificar si existe la tabla Ticket
    console.log('🔍 Verificando tabla Ticket...');
    try {
      const tickets = await prisma.ticket.findMany({
        take: 1
      });
      console.log('   ✅ Tabla Ticket existe y es accesible');
    } catch (error) {
      console.log('   ❌ Error accediendo a tabla Ticket:', error.message);
      return;
    }

    // Verificar presupuestos existentes
    console.log('\n📋 Verificando presupuestos existentes...');
    const presupuestos = await prisma.ticket.findMany({
      where: { tipo: 'presupuesto' },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`   📊 Total de presupuestos encontrados: ${presupuestos.length}`);

    if (presupuestos.length > 0) {
      console.log('\n📋 Últimos presupuestos:');
      presupuestos.slice(0, 3).forEach((presupuesto, index) => {
        console.log(`   ${index + 1}. ${presupuesto.nombre} - ${presupuesto.servicio} (${presupuesto.estado})`);
      });
    }

    // Probar crear un presupuesto de prueba
    console.log('\n🧪 Probando creación de presupuesto...');
    const testPresupuesto = await prisma.ticket.create({
      data: {
        ticketNumber: `TEST-${Date.now()}`,
        nombre: 'Usuario de Prueba',
        email: 'test@example.com',
        telefono: '123456789',
        empresa: 'Empresa de Prueba',
        servicio: 'Desarrollo Web',
        mensaje: 'Este es un presupuesto de prueba',
        tipo: 'presupuesto',
        categoria: 'solicitud',
        asunto: 'Solicitud de presupuesto - Desarrollo Web',
        descripcion: 'Solicitud de presupuesto para el servicio: Desarrollo Web\n\nMensaje: Este es un presupuesto de prueba',
        urgencia: 'normal',
        estado: 'abierto',
        prioridad: 'media'
      }
    });

    console.log('   ✅ Presupuesto de prueba creado exitosamente');
    console.log(`   📋 ID: ${testPresupuesto.id}`);
    console.log(`   🎫 Ticket Number: ${testPresupuesto.ticketNumber}`);

    // Eliminar el presupuesto de prueba
    await prisma.ticket.delete({
      where: { id: testPresupuesto.id }
    });
    console.log('   🗑️ Presupuesto de prueba eliminado');

    console.log('\n🎉 ¡API de presupuestos funciona correctamente!');
    console.log('\n💡 Para ver presupuestos en la web:');
    console.log('   • Ve a: http://localhost:3000/admin/tickets');
    console.log('   • O ejecuta: npm run dev y navega al panel de admin');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPresupuestoAPI(); 