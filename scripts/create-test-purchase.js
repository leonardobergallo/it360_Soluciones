require('dotenv').config({ path: '.env' });

async function createTestPurchase() {
  try {
    console.log('🧪 Creando ticket de compra para probar pagos...\n');

    const ticketData = {
      nombre: 'Cliente Test Pago',
      email: 'leonardobergallo@gmail.com',
      telefono: '03425089906',
      empresa: 'Empresa Test',
      tipo: 'compra',
      asunto: 'Compra de productos - Test Pago',
      descripcion: `
Solicitud de compra desde el carrito:

Productos solicitados:
• Auricular Bluetooth Pop It ST91 Varios Colores x1 - $22.275
• Apple EarPods 3.5mm A1472 x2 - $19.800

Total: $42.075

Datos del cliente:
• Nombre: Cliente Test Pago
• Email: leonardobergallo@gmail.com
• Teléfono: 03425089906
• Dirección: La Rioja, 3107 3c
• Método de pago: transferencia

Estado: Pendiente de verificación de stock y habilitación de pago
      `,
      categoria: 'venta',
      urgencia: 'normal',
      prioridad: 'media'
    };

    console.log('📝 Enviando solicitud de compra...');
    
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    console.log('✅ Ticket de compra creado exitosamente!');
    console.log(`   • Ticket ID: ${result.ticket.id}`);
    console.log(`   • Ticket Number: ${result.ticket.ticketNumber}`);
    console.log(`   • Estado: ${result.ticket.estado}`);
    console.log(`   • Tipo: ${result.ticket.tipo}`);

    console.log('\n📧 Email enviado a it360tecnologia@gmail.com');
    console.log('   • Revisa tu bandeja de entrada');
    console.log('   • Busca el email con el botón "💳 PAGAR AHORA"');

    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Ve al panel admin: http://localhost:3000/admin/solicitudes-compra');
    console.log('   2. Busca el ticket de compra');
    console.log('   3. Haz clic en "Habilitar Pago"');
    console.log('   4. El cliente recibirá un email con el enlace de pago');

    return result.ticket.ticketNumber;

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestPurchase();
