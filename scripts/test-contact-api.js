console.log('🌐 Probando API de Contact...\n');

async function testContactAPI() {
  try {
    console.log('📤 Enviando solicitud POST a /api/contact...');
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Leonardo Bergallo',
        email: 'leonardobergallo@gmail.com',
        telefono: '123456789',
        empresa: 'IT360 Soluciones',
        servicio: 'Desarrollo Web',
        mensaje: 'Necesito información sobre sus servicios'
      })
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📊 Status Text: ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error en la respuesta:');
      console.log(errorText);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Asegúrate de que el servidor esté corriendo:');
    console.log('   npm run dev');
  }
}

// También probar con Prisma directamente
async function testContactPrisma() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    console.log('\n🔍 Probando Prisma directamente...');
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite');

    // Verificar si existe la tabla Contact
    console.log('🔍 Verificando tabla Contact...');
    try {
      const contacts = await prisma.contact.findMany({
        take: 1
      });
      console.log('   ✅ Tabla Contact existe y es accesible');
    } catch (error) {
      console.log('   ❌ Error accediendo a tabla Contact:', error.message);
      return;
    }

    // Probar crear un contacto de prueba
    console.log('\n🧪 Probando creación de contacto...');
    const testContact = await prisma.contact.create({
      data: {
        name: 'Usuario de Prueba',
        email: 'test@example.com',
        message: 'Este es un contacto de prueba'
      }
    });

    console.log('   ✅ Contacto de prueba creado exitosamente');
    console.log(`   📋 ID: ${testContact.id}`);

    // Eliminar el contacto de prueba
    await prisma.contact.delete({
      where: { id: testContact.id }
    });
    console.log('   🗑️ Contacto de prueba eliminado');

    console.log('\n🎉 ¡API de contact funciona correctamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba de Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar ambas pruebas
testContactAPI().then(() => {
  testContactPrisma();
}); 