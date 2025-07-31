const { PrismaClient } = require('@prisma/client');

console.log('🔍 Verificando configuración de bases de datos...\n');

async function checkDatabases() {
  // Base de datos local (SQLite)
  const localPrisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./prisma/dev.db'
      }
    }
  });

  // Base de datos Neon (PostgreSQL)
  const neonPrisma = new PrismaClient();

  try {
    // Verificar base de datos local
    console.log('📱 Verificando base de datos LOCAL (SQLite)...');
    await localPrisma.$connect();
    
    const localContacts = await localPrisma.contact.findMany();
    const localTickets = await localPrisma.ticket.findMany();
    const localUsers = await localPrisma.user.findMany();
    const localProducts = await localPrisma.product.findMany();
    
    console.log(`✅ Base de datos LOCAL conectada:`);
    console.log(`   📧 Contactos: ${localContacts.length}`);
    console.log(`   🎫 Tickets: ${localTickets.length}`);
    console.log(`   👥 Usuarios: ${localUsers.length}`);
    console.log(`   📦 Productos: ${localProducts.length}`);

    // Verificar base de datos Neon
    console.log('\n☁️ Verificando base de datos NEON (PostgreSQL)...');
    try {
      await neonPrisma.$connect();
      
      const neonContacts = await neonPrisma.contact.findMany();
      const neonTickets = await neonPrisma.ticket.findMany();
      const neonUsers = await neonPrisma.user.findMany();
      const neonProducts = await neonPrisma.product.findMany();
      
      console.log(`✅ Base de datos NEON conectada:`);
      console.log(`   📧 Contactos: ${neonContacts.length}`);
      console.log(`   🎫 Tickets: ${neonTickets.length}`);
      console.log(`   👥 Usuarios: ${neonUsers.length}`);
      console.log(`   📦 Productos: ${neonProducts.length}`);

      // Comparar datos
      console.log('\n📊 COMPARACIÓN DE DATOS:');
      console.log('='.repeat(50));
      
      const differences = [];
      
      if (localContacts.length !== neonContacts.length) {
        differences.push(`Contactos: Local=${localContacts.length}, Neon=${neonContacts.length}`);
      }
      if (localTickets.length !== neonTickets.length) {
        differences.push(`Tickets: Local=${localTickets.length}, Neon=${neonTickets.length}`);
      }
      if (localUsers.length !== neonUsers.length) {
        differences.push(`Usuarios: Local=${localUsers.length}, Neon=${neonUsers.length}`);
      }
      if (localProducts.length !== neonProducts.length) {
        differences.push(`Productos: Local=${localProducts.length}, Neon=${neonProducts.length}`);
      }

      if (differences.length > 0) {
        console.log('🚨 SE ENCONTRARON DIFERENCIAS:');
        differences.forEach(diff => console.log(`   • ${diff}`));
        console.log('\n💡 RECOMENDACIÓN: Exportar datos locales a Neon');
        console.log('   Comando: node scripts/migrate-to-neon.js');
      } else {
        console.log('✅ LAS BASES DE DATOS ESTÁN SINCRONIZADAS');
        console.log('💡 No es necesario exportar datos');
      }

    } catch (neonError) {
      console.log('❌ No se pudo conectar a Neon PostgreSQL');
      console.log('   Posibles causas:');
      console.log('   • No tienes configurada la URL de Neon en .env');
      console.log('   • La URL de Neon no es válida');
      console.log('   • Problemas de conexión a internet');
      console.log('\n💡 Para configurar Neon:');
      console.log('   1. Crear cuenta en neon.tech');
      console.log('   2. Crear proyecto y obtener URL de conexión');
      console.log('   3. Agregar DATABASE_URL en archivo .env');
      console.log('   4. Ejecutar: node scripts/migrate-to-neon.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await localPrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

checkDatabases(); 