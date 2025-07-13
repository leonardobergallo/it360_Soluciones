const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Configuración para la base de datos SQLite actual
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

// Configuración para Neon PostgreSQL (usar la URL del .env)
const neonPrisma = new PrismaClient();

async function migrateToNeon() {
  console.log('🚀 Iniciando migración de SQLite a Neon PostgreSQL...');
  
  try {
    // 1. Verificar conexión a Neon
    console.log('📡 Verificando conexión a Neon...');
    await neonPrisma.$connect();
    console.log('✅ Conexión a Neon establecida');
    
    // 2. Migrar datos de SQLite a Neon
    console.log('📊 Migrando datos...');
    
    // Migrar Users
    const users = await sqlitePrisma.user.findMany();
    if (users.length > 0) {
      console.log(`👥 Migrando ${users.length} usuarios...`);
      for (const user of users) {
        await neonPrisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        });
      }
    }
    
    // Migrar Services
    const services = await sqlitePrisma.service.findMany();
    if (services.length > 0) {
      console.log(`🔧 Migrando ${services.length} servicios...`);
      for (const service of services) {
        await neonPrisma.service.upsert({
          where: { id: service.id },
          update: {},
          create: {
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt
          }
        });
      }
    }
    
    // Migrar Products
    const products = await sqlitePrisma.product.findMany();
    if (products.length > 0) {
      console.log(`📦 Migrando ${products.length} productos...`);
      for (const product of products) {
        await neonPrisma.product.upsert({
          where: { id: product.id },
          update: {},
          create: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          }
        });
      }
    }
    
    // Migrar Sales
    const sales = await sqlitePrisma.sale.findMany();
    if (sales.length > 0) {
      console.log(`💰 Migrando ${sales.length} ventas...`);
      for (const sale of sales) {
        await neonPrisma.sale.upsert({
          where: { id: sale.id },
          update: {},
          create: {
            id: sale.id,
            userId: sale.userId,
            productId: sale.productId,
            serviceId: sale.serviceId,
            amount: sale.amount,
            nombre: sale.nombre,
            email: sale.email,
            telefono: sale.telefono,
            direccion: sale.direccion,
            metodoPago: sale.metodoPago,
            paymentId: sale.paymentId,
            status: sale.status,
            createdAt: sale.createdAt
          }
        });
      }
    }
    
    // Migrar Contacts
    const contacts = await sqlitePrisma.contact.findMany();
    if (contacts.length > 0) {
      console.log(`📞 Migrando ${contacts.length} contactos...`);
      for (const contact of contacts) {
        await neonPrisma.contact.upsert({
          where: { id: contact.id },
          update: {},
          create: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            message: contact.message,
            createdAt: contact.createdAt
          }
        });
      }
    }
    
    // Migrar Carts
    const carts = await sqlitePrisma.cart.findMany();
    if (carts.length > 0) {
      console.log(`🛒 Migrando ${carts.length} carritos...`);
      for (const cart of carts) {
        await neonPrisma.cart.upsert({
          where: { id: cart.id },
          update: {},
          create: {
            id: cart.id,
            userId: cart.userId,
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
          }
        });
      }
    }
    
    // Migrar CartItems
    const cartItems = await sqlitePrisma.cartItem.findMany();
    if (cartItems.length > 0) {
      console.log(`🛍️ Migrando ${cartItems.length} items de carrito...`);
      for (const item of cartItems) {
        await neonPrisma.cartItem.upsert({
          where: { id: item.id },
          update: {},
          create: {
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }
        });
      }
    }
    
    // Migrar PaymentPreferences
    const paymentPreferences = await sqlitePrisma.paymentPreference.findMany();
    if (paymentPreferences.length > 0) {
      console.log(`💳 Migrando ${paymentPreferences.length} preferencias de pago...`);
      for (const pref of paymentPreferences) {
        await neonPrisma.paymentPreference.upsert({
          where: { id: pref.id },
          update: {},
          create: {
            id: pref.id,
            preferenceId: pref.preferenceId,
            userId: pref.userId,
            total: pref.total,
            status: pref.status,
            items: pref.items,
            payerInfo: pref.payerInfo,
            createdAt: pref.createdAt,
            updatedAt: pref.updatedAt
          }
        });
      }
    }
    
    console.log('✅ Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
    await neonPrisma.$disconnect();
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migrateToNeon()
    .then(() => {
      console.log('🎉 Migración finalizada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { migrateToNeon }; 