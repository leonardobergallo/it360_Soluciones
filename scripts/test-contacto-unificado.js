import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testContactoUnificado() {
  console.log('🧪 PROBANDO SISTEMA UNIFICADO DE CONTACTO');
  console.log('='.repeat(60));

  try {
    // 1. Probar creación de ticket desde contacto general
    console.log('\n📝 1. Probando contacto general...');
    const contactoGeneral = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Juan Pérez',
        email: 'juan.perez@test.com',
        telefono: '+54 9 11 1234-5678',
        empresa: 'Empresa Test S.A.',
        servicio: 'Desarrollo Web',
        mensaje: 'Necesito un presupuesto para una aplicación web'
      })
    });

    if (contactoGeneral.ok) {
      const resultadoGeneral = await contactoGeneral.json();
      console.log('✅ Contacto general creado:', resultadoGeneral.ticket?.ticketNumber);
    } else {
      console.log('❌ Error en contacto general');
    }

    // 2. Probar creación de ticket desde hogar inteligente
    console.log('\n🏠 2. Probando hogar inteligente...');
    const hogarInteligente = await fetch('http://localhost:3000/api/contacto-hogar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'María García',
        email: 'maria.garcia@test.com',
        telefono: '+54 9 11 9876-5432',
        mensaje: 'Quiero automatizar mi casa',
        tipoConsulta: 'Instalación'
      })
    });

    if (hogarInteligente.ok) {
      const resultadoHogar = await hogarInteligente.json();
      console.log('✅ Hogar inteligente creado:', resultadoHogar.ticket?.ticketNumber);
    } else {
      console.log('❌ Error en hogar inteligente');
    }

    // 3. Probar creación directa de ticket
    console.log('\n🎫 3. Probando creación directa de ticket...');
    const ticketDirecto = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Carlos López',
        email: 'carlos.lopez@test.com',
        telefono: '+54 9 11 5555-1234',
        empresa: 'Startup Tech',
        tipo: 'soporte',
        categoria: 'soporte',
        asunto: 'Problema con servidor',
        descripcion: 'El servidor no responde desde hace 2 horas',
        urgencia: 'alta'
      })
    });

    if (ticketDirecto.ok) {
      const resultadoTicket = await ticketDirecto.json();
      console.log('✅ Ticket directo creado:', resultadoTicket.ticket?.ticketNumber);
    } else {
      console.log('❌ Error en ticket directo');
    }

    // 4. Verificar tickets en base de datos
    console.log('\n📊 4. Verificando tickets en base de datos...');
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`📈 Total de tickets encontrados: ${tickets.length}`);
    tickets.forEach((ticket, index) => {
      console.log(`${index + 1}. ${ticket.ticketNumber} - ${ticket.tipo} - ${ticket.asunto}`);
    });

    // 5. Verificar contactos en base de datos
    console.log('\n📋 5. Verificando contactos en base de datos...');
    const contactos = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`📈 Total de contactos encontrados: ${contactos.length}`);
    contactos.forEach((contacto, index) => {
      console.log(`${index + 1}. ${contacto.name} - ${contacto.email}`);
    });

    console.log('\n✅ PRUEBA COMPLETADA');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testContactoUnificado(); 