const { PrismaClient } = require('@prisma/client');

// Crear una instancia de Prisma Client
const prisma = new PrismaClient();

async function seedTickets() {
  try {
    console.log('🌱 Poblando base de datos con ejemplos de tickets...\n');
    
    // Ejemplos de tickets de presupuesto
    const presupuestos = [
      {
        ticketNumber: 'PRES-001',
        nombre: 'María González',
        email: 'maria.gonzalez@empresa.com',
        telefono: '+54 11 1234-5678',
        empresa: 'TechCorp Argentina',
        servicio: 'Desarrollo de aplicación web',
        mensaje: 'Necesitamos una aplicación web para gestión de inventarios. Requerimos módulos de usuarios, productos, ventas y reportes.',
        tipo: 'presupuesto',
        categoria: 'desarrollo_web',
        asunto: 'Presupuesto: Desarrollo aplicación web',
        descripcion: 'Solicitud de presupuesto para desarrollo de aplicación web de gestión de inventarios con módulos completos.',
        urgencia: 'normal',
        estado: 'abierto',
        prioridad: 'media'
      },
      {
        ticketNumber: 'PRES-002',
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@consultora.com',
        telefono: '+54 11 9876-5432',
        empresa: 'Consultora Digital SRL',
        servicio: 'Mantenimiento de servidores',
        mensaje: 'Buscamos servicio de mantenimiento preventivo para 5 servidores Windows Server 2019. Incluir monitoreo 24/7.',
        tipo: 'presupuesto',
        categoria: 'mantenimiento',
        asunto: 'Presupuesto: Mantenimiento de servidores',
        descripcion: 'Solicitud de presupuesto para mantenimiento preventivo de 5 servidores Windows Server 2019 con monitoreo 24/7.',
        urgencia: 'alta',
        estado: 'en_proceso',
        prioridad: 'alta'
      }
    ];

    // Ejemplos de tickets de soporte técnico
    const soporte = [
      {
        ticketNumber: 'SOP-001',
        nombre: 'Ana Martínez',
        email: 'ana.martinez@cliente.com',
        telefono: '+54 11 5555-1234',
        empresa: 'Cliente VIP',
        servicio: null,
        mensaje: null,
        tipo: 'soporte',
        categoria: 'software',
        asunto: 'Error al acceder al sistema',
        descripcion: 'No puedo iniciar sesión en el sistema. Aparece error "Usuario no autorizado". Necesito ayuda urgente.',
        urgencia: 'alta',
        estado: 'abierto',
        prioridad: 'alta'
      },
      {
        ticketNumber: 'SOP-002',
        nombre: 'Luis Fernández',
        email: 'luis.fernandez@empresa.com',
        telefono: '+54 11 4444-5678',
        empresa: 'Empresa ABC',
        servicio: null,
        mensaje: null,
        tipo: 'soporte',
        categoria: 'hardware',
        asunto: 'Problema con impresora de red',
        descripcion: 'La impresora HP LaserJet no responde desde la red. Ya reinicié el equipo pero persiste el problema.',
        urgencia: 'normal',
        estado: 'abierto',
        prioridad: 'media'
      }
    ];

    // Ejemplos de tickets de consulta
    const consultas = [
      {
        ticketNumber: 'CONS-001',
        nombre: 'Roberto Silva',
        email: 'roberto.silva@nuevo.com',
        telefono: '+54 11 3333-9999',
        empresa: 'Nueva Empresa S.A.',
        servicio: null,
        mensaje: null,
        tipo: 'consulta',
        categoria: 'informacion',
        asunto: 'Consulta sobre servicios de hosting',
        descripcion: 'Quisiera información sobre los planes de hosting disponibles y si incluyen certificados SSL gratuitos.',
        urgencia: 'baja',
        estado: 'abierto',
        prioridad: 'baja'
      }
    ];

    // Ejemplos de tickets de contacto
    const contactos = [
      {
        ticketNumber: 'CONT-001',
        nombre: 'Patricia López',
        email: 'patricia.lopez@interesada.com',
        telefono: '+54 11 2222-8888',
        empresa: 'Empresa Interesada',
        servicio: null,
        mensaje: null,
        tipo: 'contacto',
        categoria: 'general',
        asunto: 'Solicitud de información comercial',
        descripcion: 'Me interesa conocer más sobre sus servicios de consultoría IT. ¿Podrían enviarme información detallada?',
        urgencia: 'normal',
        estado: 'abierto',
        prioridad: 'media'
      }
    ];

    // Combinar todos los tickets
    const todosLosTickets = [...presupuestos, ...soporte, ...consultas, ...contactos];
    
    let creados = 0;
    let errores = 0;

    // Crear cada ticket
    for (const ticket of todosLosTickets) {
      try {
        await prisma.ticket.create({
          data: ticket
        });
        creados++;
        console.log(`✅ Creado ticket: ${ticket.ticketNumber} - ${ticket.asunto}`);
      } catch (error) {
        errores++;
        console.error(`❌ Error creando ticket ${ticket.ticketNumber}:`, error.message);
      }
    }

    console.log('\n📊 Resumen de creación de tickets:');
    console.log(`   ✅ Creados exitosamente: ${creados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log(`   📋 Total procesados: ${todosLosTickets.length}`);

    if (creados > 0) {
      console.log('\n🎉 Ejemplos de tickets creados exitosamente!');
      console.log('💡 Ahora puedes ver estos tickets en el panel de administración.');
    }

  } catch (error) {
    console.error('❌ Error durante la creación de tickets:', error);
  } finally {
    // Cerrar la conexión de Prisma
    await prisma.$disconnect();
  }
}

// Ejecutar la función
seedTickets(); 