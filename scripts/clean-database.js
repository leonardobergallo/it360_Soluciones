#!/usr/bin/env node

/**
 * Script para limpiar la base de datos correctamente
 * Elimina primero las referencias de clave foránea
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Iniciando limpieza de base de datos...\n');

    // 1. Eliminar elementos del carrito primero
    console.log('🗑️ Eliminando elementos del carrito...');
    await prisma.cartItem.deleteMany();
    console.log('✅ Elementos del carrito eliminados');

    // 2. Eliminar carritos
    console.log('🛒 Eliminando carritos...');
    await prisma.cart.deleteMany();
    console.log('✅ Carritos eliminados');

    // 3. Eliminar ventas
    console.log('💰 Eliminando ventas...');
    await prisma.sale.deleteMany();
    console.log('✅ Ventas eliminadas');

    // 4. Eliminar preferencias de pago
    console.log('💳 Eliminando preferencias de pago...');
    await prisma.paymentPreference.deleteMany();
    console.log('✅ Preferencias de pago eliminadas');

    // 5. Eliminar tickets
    console.log('🎫 Eliminando tickets...');
    await prisma.ticket.deleteMany();
    console.log('✅ Tickets eliminados');

    // 6. Eliminar presupuestos
    console.log('📋 Eliminando presupuestos...');
    await prisma.presupuesto.deleteMany();
    console.log('✅ Presupuestos eliminados');

    // 7. Eliminar contactos
    console.log('📞 Eliminando contactos...');
    await prisma.contact.deleteMany();
    console.log('✅ Contactos eliminados');

    // 8. Eliminar productos
    console.log('📦 Eliminando productos...');
    await prisma.product.deleteMany();
    console.log('✅ Productos eliminados');

    // 9. Eliminar servicios
    console.log('🔧 Eliminando servicios...');
    await prisma.service.deleteMany();
    console.log('✅ Servicios eliminados');

    // 10. Eliminar usuarios (excepto el admin)
    console.log('👥 Eliminando usuarios (excepto admin)...');
    await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });
    console.log('✅ Usuarios no-admin eliminados');

    // 11. Eliminar tabla de prueba
    console.log('🧪 Eliminando tabla de prueba...');
    await prisma.testTable.deleteMany();
    console.log('✅ Tabla de prueba eliminada');

    console.log('\n🎉 ¡Base de datos limpiada exitosamente!');
    console.log('📊 Estado actual:');
    
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.service.count(),
      prisma.cart.count(),
      prisma.sale.count(),
      prisma.ticket.count(),
      prisma.presupuesto.count(),
      prisma.contact.count()
    ]);

    console.log(`   👥 Usuarios: ${counts[0]}`);
    console.log(`   📦 Productos: ${counts[1]}`);
    console.log(`   🔧 Servicios: ${counts[2]}`);
    console.log(`   🛒 Carritos: ${counts[3]}`);
    console.log(`   💰 Ventas: ${counts[4]}`);
    console.log(`   🎫 Tickets: ${counts[5]}`);
    console.log(`   📋 Presupuestos: ${counts[6]}`);
    console.log(`   📞 Contactos: ${counts[7]}`);

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase(); 