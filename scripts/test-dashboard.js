const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDashboard() {
  try {
    console.log('🧪 Probando funcionalidad del dashboard...\n');

    // Verificar conexión a la base de datos
    console.log('1️⃣ Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa\n');

    // Verificar datos existentes
    console.log('2️⃣ Verificando datos existentes...');
    
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    const services = await prisma.service.findMany();
    const sales = await prisma.sale.findMany();
    const contacts = await prisma.contact.findMany();

    console.log(`   👥 Usuarios: ${users.length}`);
    console.log(`   📦 Productos: ${products.length}`);
    console.log(`   🔧 Servicios: ${services.length}`);
    console.log(`   💰 Ventas: ${sales.length}`);
    console.log(`   📞 Contactos: ${contacts.length}\n`);

    // Verificar roles de usuarios
    console.log('3️⃣ Verificando roles de usuarios...');
    const admins = users.filter(u => u.role === 'ADMIN');
    const tecnicos = users.filter(u => u.role === 'TECNICO');
    const clientes = users.filter(u => u.role === 'USER');

    console.log(`   👑 Administradores: ${admins.length}`);
    admins.forEach(admin => {
      console.log(`      - ${admin.name} (${admin.email})`);
    });

    console.log(`   🔧 Técnicos: ${tecnicos.length}`);
    tecnicos.forEach(tecnico => {
      console.log(`      - ${tecnico.name} (${tecnico.email})`);
    });

    console.log(`   👤 Clientes: ${clientes.length}`);
    clientes.forEach(cliente => {
      console.log(`      - ${cliente.name} (${cliente.email})`);
    });

    // Verificar que las APIs funcionen
    console.log('\n4️⃣ Verificando APIs...');
    
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ API /api/users: ${data.length} usuarios`);
      } else {
        console.log(`   ❌ API /api/users: Error ${response.status}`);
      }
    } catch (error) {
      console.log('   ⚠️ API /api/users: No disponible (servidor no ejecutándose)');
    }

    try {
      const response = await fetch('http://localhost:3000/api/products');
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ API /api/products: ${data.length} productos`);
      } else {
        console.log(`   ❌ API /api/products: Error ${response.status}`);
      }
    } catch (error) {
      console.log('   ⚠️ API /api/products: No disponible (servidor no ejecutándose)');
    }

    try {
      const response = await fetch('http://localhost:3000/api/services');
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ API /api/services: ${data.length} servicios`);
      } else {
        console.log(`   ❌ API /api/services: Error ${response.status}`);
      }
    } catch (error) {
      console.log('   ⚠️ API /api/services: No disponible (servidor no ejecutándose)');
    }

    // Resumen final
    console.log('\n📊 RESUMEN DE LA PRUEBA:');
    console.log('='.repeat(50));
    
    const totalData = users.length + products.length + services.length + sales.length + contacts.length;
    
    if (totalData > 0) {
      console.log('✅ Dashboard configurado correctamente');
      console.log(`📈 Total de datos: ${totalData} registros`);
      console.log('🚀 Listo para usar');
    } else {
      console.log('❌ No hay datos en el dashboard');
      console.log('💡 Ejecuta: node scripts/check-dashboard-data.js');
    }

    console.log('\n🔐 CREDENCIALES DE PRUEBA:');
    console.log('='.repeat(50));
    if (admins.length > 0) {
      console.log(`👑 ADMIN: ${admins[0].email} / admin123`);
    }
    if (tecnicos.length > 0) {
      console.log(`🔧 TÉCNICO: ${tecnicos[0].email} / tecnico123`);
    }
    if (clientes.length > 0) {
      console.log(`👤 CLIENTE: ${clientes[0].email} / cliente123`);
    }

    console.log('\n🌐 URLs IMPORTANTES:');
    console.log('='.repeat(50));
    console.log('🏠 Sitio Principal: http://localhost:3000');
    console.log('👑 Panel Admin: http://localhost:3000/admin');
    console.log('🔧 Panel Técnico: http://localhost:3000/admin/presupuestos');
    console.log('📋 Catálogo: http://localhost:3000/catalogo');
    console.log('🛒 Carrito: http://localhost:3000/carrito');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboard(); 