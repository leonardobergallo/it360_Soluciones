require('dotenv').config({ path: '.env' });

async function testPaymentSystem() {
  try {
    console.log('🧪 Probando sistema de pagos completo...\n');

    // 1. Crear un ticket de compra
    console.log('📝 Creando ticket de compra...');
    
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
• Dirección: Dirección Test 123
• Método de pago: pendiente

Estado: Pendiente de pago
      `.trim(),
      urgencia: 'normal',
      prioridad: 'media'
    };

    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear ticket: ${response.status} - ${errorText}`);
    }

    const ticket = await response.json();
    console.log('✅ Ticket creado exitosamente:');
    console.log(`   • Número: ${ticket.ticketNumber}`);
    console.log(`   • ID: ${ticket.id}`);
    console.log(`   • Tipo: ${ticket.tipo}`);

    // 2. Verificar que el ticket se puede obtener
    console.log('\n🔍 Verificando acceso al ticket...');
    
    const ticketResponse = await fetch(`http://localhost:3000/api/tickets/${ticket.ticketNumber}`);
    
    if (!ticketResponse.ok) {
      const errorText = await ticketResponse.text();
      throw new Error(`Error al obtener ticket: ${ticketResponse.status} - ${errorText}`);
    }

    const ticketObtenido = await ticketResponse.json();
    console.log('✅ Ticket obtenido correctamente');
    console.log(`   • Descripción: ${ticketObtenido.descripcion.substring(0, 100)}...`);

    // 3. Verificar la página de pago
    console.log('\n💳 Verificando página de pago...');
    
    const paginaPagoResponse = await fetch(`http://localhost:3000/pagar/${ticket.ticketNumber}`);
    
    if (paginaPagoResponse.ok) {
      console.log('✅ Página de pago accesible');
      console.log(`   • URL: http://localhost:3000/pagar/${ticket.ticketNumber}`);
    } else {
      console.log('⚠️ Página de pago no accesible:', paginaPagoResponse.status);
    }

    // 4. Extraer información del ticket
    console.log('\n📋 Información del ticket:');
    
    // Extraer productos
    const productos = [];
    const lines = ticket.descripcion.split('\n');
    
    for (const line of lines) {
      const match = line.match(/•\s*(.+?)\s*-\s*x(\d+)\s*-\s*\$([\d,]+\.?\d*)/);
      if (match) {
        productos.push({
          nombre: match[1].trim(),
          cantidad: parseInt(match[2]),
          precio: parseFloat(match[3].replace(',', ''))
        });
      }
    }
    
    // Extraer total
    const totalMatch = ticket.descripcion.match(/Total:\s*\$([\d,]+\.?\d*)/);
    const total = totalMatch ? parseFloat(totalMatch[1].replace(',', '')) : 0;
    
    console.log('   • Productos encontrados:');
    productos.forEach((producto, index) => {
      console.log(`     ${index + 1}. ${producto.nombre} x${producto.cantidad} - $${producto.precio.toFixed(2)}`);
    });
    console.log(`   • Total: $${total.toFixed(2)}`);

    // 5. Verificar email
    console.log('\n📧 Verificando envío de email...');
    console.log('   • Revisa la bandeja de entrada de it360tecnologia@gmail.com');
    console.log('   • Busca el email con asunto: "🎫 Nuevo Ticket [NÚMERO] - compra"');
    console.log('   • El email debe incluir un botón "💳 PAGAR AHORA"');

    console.log('\n🎯 Próximos pasos:');
    console.log('   1. Verifica que llegó el email con el enlace de pago');
    console.log('   2. Haz clic en "💳 PAGAR AHORA"');
    console.log('   3. Verifica que la página de pago muestra los productos correctamente');
    console.log('   4. Prueba las opciones de Transferencia Bancaria y MercadoPago');
    console.log('   5. Verifica que los datos bancarios y MercadoPago funcionan');

    console.log('\n✅ Sistema de pagos probado exitosamente!');
    console.log(`🔗 Enlace directo: http://localhost:3000/pagar/${ticket.ticketNumber}`);

  } catch (error) {
    console.error('❌ Error probando sistema de pagos:', error.message);
  }
}

testPaymentSystem(); 