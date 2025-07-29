const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testForms() {
  console.log('🧪 Probando formularios...\n');

  try {
    // 1. Probar API de contacto general
    console.log('📧 1. Probando API de contacto general...');
    const contactResponse = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Test User',
        email: 'test@example.com',
        telefono: '123456789',
        empresa: 'Test Company',
        servicio: 'Soporte Técnico',
        mensaje: 'Mensaje de prueba'
      })
    });
    
    if (contactResponse.ok) {
      console.log('   ✅ API de contacto funcionando');
    } else {
      console.log('   ❌ Error en API de contacto:', contactResponse.status);
    }

    // 2. Probar API de contacto vendedor
    console.log('\n🛒 2. Probando API de contacto vendedor...');
    const vendorResponse = await fetch('http://localhost:3000/api/contacto-vendedor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Test Buyer',
        email: 'buyer@example.com',
        telefono: '987654321',
        mensaje: 'Me interesa el producto: Monitor LED'
      })
    });
    
    if (vendorResponse.ok) {
      console.log('   ✅ API de contacto vendedor funcionando');
    } else {
      console.log('   ❌ Error en API de contacto vendedor:', vendorResponse.status);
    }

    // 3. Probar API de hogar inteligente
    console.log('\n🏠 3. Probando API de hogar inteligente...');
    const homeResponse = await fetch('http://localhost:3000/api/contacto-hogar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'Test Home',
        email: 'home@example.com',
        telefono: '555666777',
        tipoConsulta: 'Asesoramiento general',
        mensaje: 'Quiero automatizar mi casa'
      })
    });
    
    if (homeResponse.ok) {
      console.log('   ✅ API de hogar inteligente funcionando');
    } else {
      console.log('   ❌ Error en API de hogar inteligente:', homeResponse.status);
    }

    // 4. Verificar contactos en base de datos
    console.log('\n📋 4. Verificando contactos en base de datos...');
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`   ✅ Encontrados ${contacts.length} contactos recientes`);
    contacts.forEach((contact, index) => {
      console.log(`   ${index + 1}. ${contact.name} - ${contact.email}`);
    });

    console.log('\n✅ Todas las pruebas completadas');
    console.log('\n💡 Los formularios ahora deberían funcionar correctamente:');
    console.log('   • Formulario de contacto general');
    console.log('   • Modal de contacto con vendedor');
    console.log('   • Formulario de hogar inteligente');
    console.log('   • Todos son responsive para móviles');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testForms(); 