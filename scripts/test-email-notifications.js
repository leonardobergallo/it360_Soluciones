const { sendPresupuestoNotification, sendContactNotification, sendVentaNotification } = require('../lib/email-service');

console.log('📧 Probando notificaciones por email...\n');

async function testEmailNotifications() {
  try {
    console.log('1️⃣ Probando notificación de presupuesto...');
    await sendPresupuestoNotification({
      ticketNumber: 'PRES-TEST-001',
      nombre: 'Juan Pérez',
      email: 'juan@test.com',
      telefono: '123456789',
      empresa: 'Empresa Test',
      servicio: 'Desarrollo Web',
      mensaje: 'Necesito un sitio web para mi empresa',
      estado: 'abierto',
      createdAt: new Date()
    });

    console.log('2️⃣ Probando notificación de contacto...');
    await sendContactNotification({
      name: 'María García',
      email: 'maria@test.com',
      message: 'Hola, tengo una consulta sobre sus servicios',
      createdAt: new Date()
    });

    console.log('3️⃣ Probando notificación de venta...');
    await sendVentaNotification({
      nombre: 'Carlos López',
      email: 'carlos@test.com',
      telefono: '987654321',
      direccion: 'Av. Test 123, Buenos Aires',
      metodoPago: 'transferencia',
      amount: 50000,
      status: 'pendiente'
    });

    console.log('\n✅ Todas las notificaciones enviadas correctamente!');
    console.log('📧 Revisa tu email para ver las notificaciones');

  } catch (error) {
    console.error('❌ Error probando notificaciones:', error);
    console.log('\n💡 Asegúrate de:');
    console.log('1. Configurar GMAIL_USER y GMAIL_PASS en .env');
    console.log('2. Usar contraseña de aplicación de Gmail');
    console.log('3. Tener verificación en 2 pasos activada');
  }
}

testEmailNotifications(); 