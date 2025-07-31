const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function migrateToNeon() {
  console.log('🚀 Iniciando migración simple de SQLite a Neon...');
  
  let db = null;
  let neonPrisma = null;
  
  try {
    // 1. Conectar a SQLite directamente
    console.log('📡 Conectando a SQLite...');
    const dbPath = path.join(__dirname, '../prisma/dev.db');
    db = new sqlite3.Database(dbPath);
    
    // 2. Conectar a Neon
    console.log('📡 Conectando a Neon...');
    neonPrisma = new PrismaClient();
    await neonPrisma.$connect();
    console.log('✅ Conexión a Neon establecida');
    
    // 3. Migrar datos usando SQLite directamente
    console.log('📊 Migrando datos...');
    
    // Función helper para ejecutar consultas SQLite
    const querySqlite = (sql) => {
      return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };
    
    // Migrar Users
    console.log('👥 Migrando usuarios...');
    const users = await querySqlite('SELECT * FROM User');
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
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      });
    }
    console.log(`✅ ${users.length} usuarios migrados`);
    
    // Migrar Services
    console.log('🔧 Migrando servicios...');
    const services = await querySqlite('SELECT * FROM Service');
    for (const service of services) {
      await neonPrisma.service.upsert({
        where: { id: service.id },
        update: {},
        create: {
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          active: service.active !== 0,
          order: service.order || 0,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt)
        }
      });
    }
    console.log(`✅ ${services.length} servicios migrados`);
    
    // Migrar Products
    console.log('📦 Migrando productos...');
    const products = await querySqlite('SELECT * FROM Product');
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
          active: product.active !== 0,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt)
        }
      });
    }
    console.log(`✅ ${products.length} productos migrados`);
    
    // Migrar Sales
    console.log('💰 Migrando ventas...');
    const sales = await querySqlite('SELECT * FROM Sale');
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
          createdAt: new Date(sale.createdAt)
        }
      });
    }
    console.log(`✅ ${sales.length} ventas migradas`);
    
    // Migrar Contacts
    console.log('📞 Migrando contactos...');
    const contacts = await querySqlite('SELECT * FROM Contact');
    for (const contact of contacts) {
      await neonPrisma.contact.upsert({
        where: { id: contact.id },
        update: {},
        create: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          message: contact.message,
          createdAt: new Date(contact.createdAt)
        }
      });
    }
    console.log(`✅ ${contacts.length} contactos migrados`);
    
    // Migrar Carts
    console.log('🛒 Migrando carritos...');
    const carts = await querySqlite('SELECT * FROM Cart');
    for (const cart of carts) {
      await neonPrisma.cart.upsert({
        where: { id: cart.id },
        update: {},
        create: {
          id: cart.id,
          userId: cart.userId,
          createdAt: new Date(cart.createdAt),
          updatedAt: new Date(cart.updatedAt)
        }
      });
    }
    console.log(`✅ ${carts.length} carritos migrados`);
    
    // Migrar CartItems
    console.log('🛍️ Migrando items de carrito...');
    const cartItems = await querySqlite('SELECT * FROM CartItem');
    for (const item of cartItems) {
      await neonPrisma.cartItem.upsert({
        where: { id: item.id },
        update: {},
        create: {
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }
      });
    }
    console.log(`✅ ${cartItems.length} items de carrito migrados`);
    
    // Migrar PaymentPreferences
    console.log('💳 Migrando preferencias de pago...');
    const paymentPreferences = await querySqlite('SELECT * FROM PaymentPreference');
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
          createdAt: new Date(pref.createdAt),
          updatedAt: new Date(pref.updatedAt)
        }
      });
    }
    console.log(`✅ ${paymentPreferences.length} preferencias de pago migradas`);
    
    // Migrar Tickets
    console.log('🎫 Migrando tickets...');
    const tickets = await querySqlite('SELECT * FROM Ticket');
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
          resueltoEn: ticket.resueltoEn ? new Date(ticket.resueltoEn) : null,
          createdAt: new Date(ticket.createdAt),
          updatedAt: new Date(ticket.updatedAt)
        }
      });
    }
    console.log(`✅ ${tickets.length} tickets migrados`);
    
    console.log('🎉 ¡Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    if (db) {
      db.close();
    }
    if (neonPrisma) {
      await neonPrisma.$disconnect();
    }
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