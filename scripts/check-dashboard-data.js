#!/usr/bin/env node

/**
 * Script para verificar datos del dashboard
 * Verifica que haya productos y servicios en la base de datos
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDashboardData() {
  console.log('🔍 Verificando datos del dashboard...\n');

  try {
    // 1. Verificar productos
    console.log('📦 1. Verificando productos...');
    const products = await prisma.product.findMany();
    console.log(`   📊 Total de productos: ${products.length}`);
    
    if (products.length > 0) {
      console.log('   ✅ Productos encontrados:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`      ${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`);
      });
      if (products.length > 3) {
        console.log(`      ... y ${products.length - 3} más`);
      }
    } else {
      console.log('   ❌ No hay productos en la base de datos');
    }

    // 2. Verificar servicios
    console.log('\n🔧 2. Verificando servicios...');
    const services = await prisma.service.findMany();
    console.log(`   📊 Total de servicios: ${services.length}`);
    
    if (services.length > 0) {
      console.log('   ✅ Servicios encontrados:');
      services.slice(0, 3).forEach((service, index) => {
        console.log(`      ${index + 1}. ${service.name} - $${service.price}`);
      });
      if (services.length > 3) {
        console.log(`      ... y ${services.length - 3} más`);
      }
    } else {
      console.log('   ❌ No hay servicios en la base de datos');
    }

    // 3. Verificar usuarios
    console.log('\n👥 3. Verificando usuarios...');
    const users = await prisma.user.findMany();
    console.log(`   📊 Total de usuarios: ${users.length}`);
    
    const admins = users.filter(u => u.role === 'ADMIN');
    const tecnicos = users.filter(u => u.role === 'TECNICO');
    const clientes = users.filter(u => u.role === 'USER');
    
    console.log(`   👑 Administradores: ${admins.length}`);
    console.log(`   🔧 Técnicos: ${tecnicos.length}`);
    console.log(`   👤 Clientes: ${clientes.length}`);

    // 4. Verificar ventas
    console.log('\n💰 4. Verificando ventas...');
    const sales = await prisma.sale.findMany();
    console.log(`   📊 Total de ventas: ${sales.length}`);

    // 5. Verificar presupuestos
    console.log('\n📋 5. Verificando presupuestos...');
    const presupuestos = await prisma.presupuesto.findMany();
    console.log(`   📊 Total de presupuestos: ${presupuestos.length}`);

    // 6. Resumen
    console.log('\n============================================================');
    console.log('📋 RESUMEN DE DATOS');
    console.log('============================================================');
    console.log(`📦 Productos: ${products.length}`);
    console.log(`🔧 Servicios: ${services.length}`);
    console.log(`👥 Usuarios: ${users.length}`);
    console.log(`💰 Ventas: ${sales.length}`);
    console.log(`📋 Presupuestos: ${presupuestos.length}`);
    
    if (products.length === 0 && services.length === 0) {
      console.log('\n⚠️ ADVERTENCIA: No hay productos ni servicios en la base de datos');
      console.log('   💡 Ejecuta: node scripts/seed.js para poblar datos de ejemplo');
    } else if (products.length === 0) {
      console.log('\n⚠️ ADVERTENCIA: No hay productos en la base de datos');
      console.log('   💡 Ejecuta: node scripts/seed.js para poblar productos');
    } else if (services.length === 0) {
      console.log('\n⚠️ ADVERTENCIA: No hay servicios en la base de datos');
      console.log('   💡 Ejecuta: node scripts/seed.js para poblar servicios');
    } else {
      console.log('\n✅ Todos los datos están disponibles');
    }

    console.log('\n🚀 Si los datos están disponibles pero no se ven en el dashboard:');
    console.log('   • Verifica que el servidor esté corriendo: npm run dev');
    console.log('   • Revisa la consola del navegador para errores');
    console.log('   • Verifica que el usuario tenga rol ADMIN');
    console.log('   • Limpia localStorage y vuelve a loguear');

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
    console.log('\n💡 Posibles soluciones:');
    console.log('   • Verifica la conexión a la base de datos');
    console.log('   • Ejecuta: npx prisma db push');
    console.log('   • Ejecuta: npx prisma generate');
  } finally {
    await prisma.$disconnect();
  }
}

checkDashboardData(); 