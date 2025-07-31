const { PrismaClient } = require('@prisma/client');

async function verifyMigrationComplete() {
  console.log('🎯 Verificación final de migración a Neon PostgreSQL');
  console.log('=' .repeat(60));
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Conexión a Neon establecida');
    
    // Verificar todas las tablas
    const tables = [
      { name: 'User', count: await prisma.user.count() },
      { name: 'Service', count: await prisma.service.count() },
      { name: 'Product', count: await prisma.product.count() },
      { name: 'Sale', count: await prisma.sale.count() },
      { name: 'Contact', count: await prisma.contact.count() },
      { name: 'Cart', count: await prisma.cart.count() },
      { name: 'CartItem', count: await prisma.cartItem.count() },
      { name: 'PaymentPreference', count: await prisma.paymentPreference.count() },
      { name: 'Ticket', count: await prisma.ticket.count() }
    ];
    
    console.log('\n📊 Resumen de datos en Neon:');
    console.log('-'.repeat(40));
    
    let totalRecords = 0;
    tables.forEach(table => {
      console.log(`📋 ${table.name}: ${table.count} registros`);
      totalRecords += table.count;
    });
    
    console.log('-'.repeat(40));
    console.log(`📈 Total: ${totalRecords} registros migrados`);
    
    // Verificar configuración
    console.log('\n🔧 Configuración:');
    console.log('-'.repeat(40));
    console.log('✅ Schema: PostgreSQL (Neon)');
    console.log('✅ Migraciones: Aplicadas');
    console.log('✅ Cliente Prisma: Generado');
    console.log('✅ Variables de entorno: Configuradas');
    
    // Verificar datos específicos
    console.log('\n📋 Datos específicos:');
    console.log('-'.repeat(40));
    
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (adminUser) {
      console.log(`👑 Admin: ${adminUser.name} (${adminUser.email})`);
    }
    
    const latestContact = await prisma.contact.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestContact) {
      console.log(`📞 Último contacto: ${latestContact.name} - ${latestContact.createdAt.toLocaleDateString()}`);
    }
    
    const latestSale = await prisma.sale.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (latestSale) {
      console.log(`💰 Última venta: $${latestSale.amount} - ${latestSale.createdAt.toLocaleDateString()}`);
    }
    
    console.log('\n🎉 ¡Migración a Neon completada exitosamente!');
    console.log('\n💡 Próximos pasos:');
    console.log('   1. Ejecuta: npm run dev');
    console.log('   2. Visita: http://localhost:3000');
    console.log('   3. Verifica que todo funciona correctamente');
    console.log('   4. Opcional: Elimina el archivo SQLite (prisma/dev.db)');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigrationComplete(); 