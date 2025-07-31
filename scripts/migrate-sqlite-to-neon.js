const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Función para crear un cliente Prisma con configuración específica
function createPrismaClient(databaseUrl, schemaPath = null) {
  const config = {
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  };
  
  if (schemaPath) {
    config.schemaPath = schemaPath;
  }
  
  return new PrismaClient(config);
}

async function migrateSqliteToNeon() {
  console.log('🚀 Iniciando migración de SQLite a Neon PostgreSQL...');
  
  let sqlitePrisma = null;
  let neonPrisma = null;
  
  try {
    // 1. Crear cliente para SQLite usando el schema específico
    console.log('📡 Conectando a SQLite...');
    sqlitePrisma = createPrismaClient('file:./prisma/dev.db', './prisma/schema-sqlite.prisma');
    await sqlitePrisma.$connect();
    console.log('✅ Conexión a SQLite establecida');
    
    // 2. Crear cliente para Neon
    console.log('📡 Conectando a Neon...');
    neonPrisma = createPrismaClient(process.env.DATABASE_URL);
    await neonPrisma.$connect();
    console.log('✅ Conexión a Neon establecida');
    
    // 3. Migrar datos
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
      console.log('✅ Usuarios migrados');
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
            active: service.active || true,
            order: service.order || 0,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt
          }
        });
      }
      console.log('✅ Servicios migrados');
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
            basePrice: product.basePrice,
            markup: product.markup,
            stock: product.stock,
            category: product.category,
            image: product.image,
            active: product.active || true,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          }
        });
      }
      console.log('✅ Productos migrados');
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
      console.log('✅ Ventas migradas');
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
      console.log('✅ Contactos migrados');
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
      console.log('✅ Carritos migrados');
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
      console.log('✅ Items de carrito migrados');
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
      console.log('✅ Preferencias de pago migradas');
    }
    
    // Migrar Tickets
    const tickets = await sqlitePrisma.ticket.findMany();
    if (tickets.length > 0) {
      console.log(`🎫 Migrando ${tickets.length} tickets...`);
      for (const ticket of tickets) {
        await neonPrisma.ticket.upsert({
          where: { id: ticket.id },
          update: {},
          create: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            nombre: ticket.nombre,
            email: ticket.email,
            telefono: ticket.telefono,
            empresa: ticket.empresa,
            servicio: ticket.servicio,
            mensaje: ticket.mensaje,
            tipo: ticket.tipo,
            categoria: ticket.categoria,
            asunto: ticket.asunto,
            descripcion: ticket.descripcion,
            urgencia: ticket.urgencia,
            estado: ticket.estado,
            prioridad: ticket.prioridad,
            asignadoA: ticket.asignadoA,
            notas: ticket.notas,
            resueltoEn: ticket.resueltoEn,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt
          }
        });
      }
      console.log('✅ Tickets migrados');
    }
    
    console.log('🎉 ¡Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    if (sqlitePrisma) {
      await sqlitePrisma.$disconnect();
    }
    if (neonPrisma) {
      await neonPrisma.$disconnect();
    }
  }
}

// Ejecutar migración si se llama directamente
if (require.main === module) {
  migrateSqliteToNeon()
    .then(() => {
      console.log('🎉 Migración finalizada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { migrateSqliteToNeon }; 