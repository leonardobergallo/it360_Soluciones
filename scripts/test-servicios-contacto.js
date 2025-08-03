import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testServiciosContacto() {
  console.log('🧪 PROBANDO FUNCIONALIDAD DE CONTACTO DESDE SERVICIOS');
  console.log('='.repeat(60));

  try {
    // 1. Verificar servicios disponibles
    console.log('\n📋 1. Verificando servicios disponibles...');
    const servicios = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        price: true,
        description: true
      }
    });

    console.log(`✅ Total de servicios activos: ${servicios.length}`);
    servicios.forEach((servicio, index) => {
      console.log(`   ${index + 1}. ${servicio.name} - $${servicio.price}`);
    });

    // 2. Simular envío de consulta desde servicio
    console.log('\n📝 2. Simulando consulta desde servicio...');
    const servicioSeleccionado = servicios[0]; // Tomar el primer servicio como ejemplo
    
    const consultaData = {
      nombre: 'Cliente de Prueba',
      email: 'cliente.prueba@test.com',
      telefono: '+54 9 11 1234-5678',
      empresa: 'Empresa Test S.A.',
      tipoConsulta: 'presupuesto',
      urgencia: 'normal',
      asunto: `Solicitud de presupuesto - ${servicioSeleccionado.name}`,
      descripcion: `Estoy interesado en el servicio de ${servicioSeleccionado.name}. Necesito más información sobre precios y tiempos de entrega.`,
      servicio: servicioSeleccionado.name,
      presupuesto: ''
    };

    console.log(`📧 Enviando consulta para: ${servicioSeleccionado.name}`);
    console.log(`👤 Cliente: ${consultaData.nombre}`);
    console.log(`📧 Email: ${consultaData.email}`);

    // 3. Crear ticket de prueba
    console.log('\n🎫 3. Creando ticket de prueba...');
    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const nuevoTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        nombre: consultaData.nombre,
        email: consultaData.email,
        telefono: consultaData.telefono,
        empresa: consultaData.empresa,
        tipo: consultaData.tipoConsulta,
        categoria: consultaData.tipoConsulta,
        asunto: consultaData.asunto,
        descripcion: `${consultaData.descripcion}\n\nServicio específico: ${consultaData.servicio}`,
        urgencia: consultaData.urgencia,
        prioridad: 'media',
        estado: 'abierto'
      }
    });

    console.log(`✅ Ticket creado: ${nuevoTicket.ticketNumber}`);
    console.log(`📝 Asunto: ${nuevoTicket.asunto}`);
    console.log(`🏷️ Tipo: ${nuevoTicket.tipo}`);

    // 4. Verificar tickets recientes
    console.log('\n📊 4. Verificando tickets recientes...');
    const ticketsRecientes = await prisma.ticket.findMany({
      where: {
        tipo: 'presupuesto',
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Últimas 24 horas
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`📈 Tickets de presupuesto en las últimas 24h: ${ticketsRecientes.length}`);
    ticketsRecientes.forEach((ticket, index) => {
      console.log(`   ${index + 1}. ${ticket.ticketNumber} - ${ticket.nombre} - ${ticket.asunto}`);
    });

    // 5. Estadísticas generales
    console.log('\n📈 5. Estadísticas generales...');
    const totalTickets = await prisma.ticket.count();
    const ticketsPresupuesto = await prisma.ticket.count({ where: { tipo: 'presupuesto' } });
    const ticketsAbiertos = await prisma.ticket.count({ where: { estado: 'abierto' } });

    console.log(`📊 Total de tickets: ${totalTickets}`);
    console.log(`💰 Tickets de presupuesto: ${ticketsPresupuesto}`);
    console.log(`🔓 Tickets abiertos: ${ticketsAbiertos}`);

    console.log('\n✅ PRUEBA COMPLETADA EXITOSAMENTE');
    console.log('='.repeat(60));
    console.log('🌐 Para probar en la web:');
    console.log('   1. Ve a: http://localhost:3001/servicios');
    console.log('   2. Haz clic en "Ver Detalles" de cualquier servicio');
    console.log('   3. Deberías ir directamente al formulario de contacto');
    console.log('   4. El servicio estará pre-seleccionado');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testServiciosContacto(); 