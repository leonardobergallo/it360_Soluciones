const { PrismaClient } = require('@prisma/client');

// Configuración para la base de datos SQLite local
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

// Configuración para Neon PostgreSQL (usar la URL del .env)
const neonPrisma = new PrismaClient();

async function checkDatabaseDifferences() {
  console.log('🔍 Verificando diferencias entre SQLite local y Neon PostgreSQL...\n');
  
  let hasDifferences = false;
  const differences = [];

  try {
    // Conectar a ambas bases de datos
    await sqlitePrisma.$connect();
    await neonPrisma.$connect();
    console.log('✅ Conexiones establecidas\n');

    // 1. Comparar Users
    console.log('👥 Comparando usuarios...');
    const localUsers = await sqlitePrisma.user.findMany();
    const neonUsers = await neonPrisma.user.findMany();
    
    if (localUsers.length !== neonUsers.length) {
      hasDifferences = true;
      differences.push(`Usuarios: Local=${localUsers.length}, Neon=${neonUsers.length}`);
      console.log(`⚠️  Diferencia en usuarios: Local=${localUsers.length}, Neon=${neonUsers.length}`);
    } else {
      console.log(`✅ Usuarios: ${localUsers.length} (iguales)`);
    }

    // 2. Comparar Products
    console.log('📦 Comparando productos...');
    const localProducts = await sqlitePrisma.product.findMany();
    const neonProducts = await neonPrisma.product.findMany();
    
    if (localProducts.length !== neonProducts.length) {
      hasDifferences = true;
      differences.push(`Productos: Local=${localProducts.length}, Neon=${neonProducts.length}`);
      console.log(`⚠️  Diferencia en productos: Local=${localProducts.length}, Neon=${neonProducts.length}`);
    } else {
      console.log(`✅ Productos: ${localProducts.length} (iguales)`);
    }

    // 3. Comparar Services
    console.log('🔧 Comparando servicios...');
    const localServices = await sqlitePrisma.service.findMany();
    const neonServices = await neonPrisma.service.findMany();
    
    if (localServices.length !== neonServices.length) {
      hasDifferences = true;
      differences.push(`Servicios: Local=${localServices.length}, Neon=${neonServices.length}`);
      console.log(`⚠️  Diferencia en servicios: Local=${localServices.length}, Neon=${neonServices.length}`);
    } else {
      console.log(`✅ Servicios: ${localServices.length} (iguales)`);
    }

    // 4. Comparar Contacts
    console.log('📧 Comparando contactos...');
    const localContacts = await sqlitePrisma.contact.findMany();
    const neonContacts = await neonPrisma.contact.findMany();
    
    if (localContacts.length !== neonContacts.length) {
      hasDifferences = true;
      differences.push(`Contactos: Local=${localContacts.length}, Neon=${neonContacts.length}`);
      console.log(`⚠️  Diferencia en contactos: Local=${localContacts.length}, Neon=${neonContacts.length}`);
    } else {
      console.log(`✅ Contactos: ${localContacts.length} (iguales)`);
    }

    // 5. Comparar Tickets/Presupuestos
    console.log('🎫 Comparando tickets...');
    const localTickets = await sqlitePrisma.ticket.findMany();
    const neonTickets = await neonPrisma.ticket.findMany();
    
    if (localTickets.length !== neonTickets.length) {
      hasDifferences = true;
      differences.push(`Tickets: Local=${localTickets.length}, Neon=${neonTickets.length}`);
      console.log(`⚠️  Diferencia en tickets: Local=${localTickets.length}, Neon=${neonTickets.length}`);
    } else {
      console.log(`✅ Tickets: ${localTickets.length} (iguales)`);
    }

    // 6. Comparar Sales
    console.log('💰 Comparando ventas...');
    const localSales = await sqlitePrisma.sale.findMany();
    const neonSales = await neonPrisma.sale.findMany();
    
    if (localSales.length !== neonSales.length) {
      hasDifferences = true;
      differences.push(`Ventas: Local=${localSales.length}, Neon=${neonSales.length}`);
      console.log(`⚠️  Diferencia en ventas: Local=${localSales.length}, Neon=${neonSales.length}`);
    } else {
      console.log(`✅ Ventas: ${localSales.length} (iguales)`);
    }

    // 7. Comparar Carts
    console.log('🛒 Comparando carritos...');
    const localCarts = await sqlitePrisma.cart.findMany();
    const neonCarts = await neonPrisma.cart.findMany();
    
    if (localCarts.length !== neonCarts.length) {
      hasDifferences = true;
      differences.push(`Carritos: Local=${localCarts.length}, Neon=${neonCarts.length}`);
      console.log(`⚠️  Diferencia en carritos: Local=${localCarts.length}, Neon=${neonCarts.length}`);
    } else {
      console.log(`✅ Carritos: ${localCarts.length} (iguales)`);
    }

    // 8. Comparar CartItems
    console.log('🛍️ Comparando items de carrito...');
    const localCartItems = await sqlitePrisma.cartItem.findMany();
    const neonCartItems = await neonPrisma.cartItem.findMany();
    
    if (localCartItems.length !== neonCartItems.length) {
      hasDifferences = true;
      differences.push(`Items de carrito: Local=${localCartItems.length}, Neon=${neonCartItems.length}`);
      console.log(`⚠️  Diferencia en items de carrito: Local=${localCartItems.length}, Neon=${neonCartItems.length}`);
    } else {
      console.log(`✅ Items de carrito: ${localCartItems.length} (iguales)`);
    }

    // 9. Comparar PaymentPreferences
    console.log('💳 Comparando preferencias de pago...');
    const localPaymentPrefs = await sqlitePrisma.paymentPreference.findMany();
    const neonPaymentPrefs = await neonPrisma.paymentPreference.findMany();
    
    if (localPaymentPrefs.length !== neonPaymentPrefs.length) {
      hasDifferences = true;
      differences.push(`Preferencias de pago: Local=${localPaymentPrefs.length}, Neon=${neonPaymentPrefs.length}`);
      console.log(`⚠️  Diferencia en preferencias de pago: Local=${localPaymentPrefs.length}, Neon=${neonPaymentPrefs.length}`);
    } else {
      console.log(`✅ Preferencias de pago: ${localPaymentPrefs.length} (iguales)`);
    }

    // Resumen final
    console.log('\n' + '='.repeat(60));
    if (hasDifferences) {
      console.log('🚨 SE ENCONTRARON DIFERENCIAS ENTRE LAS BASES DE DATOS');
      console.log('='.repeat(60));
      console.log('📊 Resumen de diferencias:');
      differences.forEach(diff => console.log(`   • ${diff}`));
      console.log('\n💡 RECOMENDACIÓN: Ejecutar migración a Neon');
      console.log('   Comando: node scripts/migrate-to-neon.js');
    } else {
      console.log('✅ LAS BASES DE DATOS ESTÁN SINCRONIZADAS');
      console.log('='.repeat(60));
      console.log('🎉 No se encontraron diferencias entre SQLite local y Neon');
      console.log('💡 No es necesario exportar datos');
    }

  } catch (error) {
    console.error('❌ Error al verificar diferencias:', error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  checkDatabaseDifferences()
    .then(() => {
      console.log('\n🎯 Verificación completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseDifferences }; 