const { PrismaClient } = require('@prisma/client');

async function checkNeonData() {
  console.log('🔍 Verificando datos en Neon...');
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Conectado a Neon');
    
    // Verificar Users
    const users = await prisma.user.findMany();
    console.log(`👥 Usuarios en Neon: ${users.length}`);
    
    // Verificar Services
    const services = await prisma.service.findMany();
    console.log(`🔧 Servicios en Neon: ${services.length}`);
    
    // Verificar Products
    const products = await prisma.product.findMany();
    console.log(`📦 Productos en Neon: ${products.length}`);
    
    // Verificar Sales
    const sales = await prisma.sale.findMany();
    console.log(`💰 Ventas en Neon: ${sales.length}`);
    
    // Verificar Contacts
    const contacts = await prisma.contact.findMany();
    console.log(`📞 Contactos en Neon: ${contacts.length}`);
    
    // Verificar Carts
    const carts = await prisma.cart.findMany();
    console.log(`🛒 Carritos en Neon: ${carts.length}`);
    
    // Verificar CartItems
    const cartItems = await prisma.cartItem.findMany();
    console.log(`🛍️ Items de carrito en Neon: ${cartItems.length}`);
    
    // Verificar PaymentPreferences
    const paymentPreferences = await prisma.paymentPreference.findMany();
    console.log(`💳 Preferencias de pago en Neon: ${paymentPreferences.length}`);
    
    // Verificar Tickets
    const tickets = await prisma.ticket.findMany();
    console.log(`🎫 Tickets en Neon: ${tickets.length}`);
    
    if (contacts.length > 0) {
      console.log('\n📧 Contactos en Neon:');
      contacts.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name} (${contact.email})`);
        console.log(`   📅 Creado: ${contact.createdAt.toLocaleString()}`);
        console.log(`   💬 Mensaje: ${contact.message.substring(0, 50)}...`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNeonData(); 