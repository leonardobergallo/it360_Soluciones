const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configuración para Neon (origen)
const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL // URL de Neon
    }
  }
});

// Configuración para SQLite local (destino)
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db' // SQLite local
    }
  }
});

async function migrateData() {
  console.log('🚀 Iniciando migración de Neon a SQLite...');
  
  try {
    // 1. Migrar Users
    console.log('📦 Migrando Users...');
    const users = await neonPrisma.user.findMany();
    console.log(`   Encontrados ${users.length} usuarios`);
    
    for (const user of users) {
      await sqlitePrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      });
    }
    console.log('   ✅ Users migrados');

    // 2. Migrar Services
    console.log('📦 Migrando Services...');
    const services = await neonPrisma.service.findMany();
    console.log(`   Encontrados ${services.length} servicios`);
    
    for (const service of services) {
      await sqlitePrisma.service.upsert({
        where: { id: service.id },
        update: service,
        create: service
      });
    }
    console.log('   ✅ Services migrados');

    // 3. Migrar Products
    console.log('📦 Migrando Products...');
    const products = await neonPrisma.product.findMany();
    console.log(`   Encontrados ${products.length} productos`);
    
    for (const product of products) {
      await sqlitePrisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      });
    }
    console.log('   ✅ Products migrados');

    // 4. Migrar Sales
    console.log('📦 Migrando Sales...');
    const sales = await neonPrisma.sale.findMany();
    console.log(`   Encontrados ${sales.length} ventas`);
    
    for (const sale of sales) {
      await sqlitePrisma.sale.upsert({
        where: { id: sale.id },
        update: sale,
        create: sale
      });
    }
    console.log('   ✅ Sales migrados');

    // 5. Migrar Contacts
    console.log('📦 Migrando Contacts...');
    const contacts = await neonPrisma.contact.findMany();
    console.log(`   Encontrados ${contacts.length} contactos`);
    
    for (const contact of contacts) {
      await sqlitePrisma.contact.upsert({
        where: { id: contact.id },
        update: contact,
        create: contact
      });
    }
    console.log('   ✅ Contacts migrados');

    // 6. Migrar Carts
    console.log('📦 Migrando Carts...');
    const carts = await neonPrisma.cart.findMany();
    console.log(`   Encontrados ${carts.length} carritos`);
    
    for (const cart of carts) {
      await sqlitePrisma.cart.upsert({
        where: { id: cart.id },
        update: cart,
        create: cart
      });
    }
    console.log('   ✅ Carts migrados');

    // 7. Migrar CartItems
    console.log('📦 Migrando CartItems...');
    const cartItems = await neonPrisma.cartItem.findMany();
    console.log(`   Encontrados ${cartItems.length} items de carrito`);
    
    for (const cartItem of cartItems) {
      await sqlitePrisma.cartItem.upsert({
        where: { id: cartItem.id },
        update: cartItem,
        create: cartItem
      });
    }
    console.log('   ✅ CartItems migrados');

    // 8. Migrar PaymentPreferences
    console.log('📦 Migrando PaymentPreferences...');
    const paymentPreferences = await neonPrisma.paymentPreference.findMany();
    console.log(`   Encontrados ${paymentPreferences.length} preferencias de pago`);
    
    for (const preference of paymentPreferences) {
      await sqlitePrisma.paymentPreference.upsert({
        where: { id: preference.id },
        update: preference,
        create: preference
      });
    }
    console.log('   ✅ PaymentPreferences migrados');

    // 9. Migrar Tickets
    console.log('📦 Migrando Tickets...');
    const tickets = await neonPrisma.ticket.findMany();
    console.log(`   Encontrados ${tickets.length} tickets`);
    
    for (const ticket of tickets) {
      await sqlitePrisma.ticket.upsert({
        where: { id: ticket.id },
        update: ticket,
        create: ticket
      });
    }
    console.log('   ✅ Tickets migrados');

    // 10. Migrar TestTable
    console.log('📦 Migrando TestTable...');
    const testTables = await neonPrisma.testTable.findMany();
    console.log(`   Encontrados ${testTables.length} registros de test`);
    
    for (const testTable of testTables) {
      await sqlitePrisma.testTable.upsert({
        where: { id: testTable.id },
        update: testTable,
        create: testTable
      });
    }
    console.log('   ✅ TestTable migrados');

    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Sales: ${sales.length}`);
    console.log(`   - Contacts: ${contacts.length}`);
    console.log(`   - Carts: ${carts.length}`);
    console.log(`   - CartItems: ${cartItems.length}`);
    console.log(`   - PaymentPreferences: ${paymentPreferences.length}`);
    console.log(`   - Tickets: ${tickets.length}`);
    console.log(`   - TestTable: ${testTables.length}`);
    
    console.log('\n💾 Base de datos SQLite creada en: ./dev.db');
    console.log('🔧 Para usar SQLite local, cambia DATABASE_URL en .env a: file:./dev.db');

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await neonPrisma.$disconnect();
    await sqlitePrisma.$disconnect();
  }
}

// Ejecutar migración
migrateData(); 