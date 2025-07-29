const { PrismaClient } = require('@prisma/client');

console.log('📋 Mostrando todos los contactos/mensajes recibidos...\n');

async function showContacts() {
  const prisma = new PrismaClient();
  
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');
    
    // Obtener todos los contactos ordenados por fecha de creación (más recientes primero)
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Total de contactos encontrados: ${contacts.length}\n`);
    
    if (contacts.length === 0) {
      console.log('❌ No hay contactos en la base de datos');
      return;
    }
    
    // Mostrar cada contacto con detalles
    contacts.forEach((contact, index) => {
      console.log(`📧 Contacto #${index + 1}`);
      console.log('='.repeat(50));
      console.log(`👤 Nombre: ${contact.name}`);
      console.log(`📧 Email: ${contact.email}`);
      console.log(`📅 Fecha: ${contact.createdAt.toLocaleString('es-AR')}`);
      console.log(`🆔 ID: ${contact.id}`);
      console.log(`💬 Mensaje:`);
      console.log(contact.message);
      console.log('='.repeat(50));
      console.log('');
    });
    
    // Estadísticas
    console.log('📈 Estadísticas:');
    console.log(`   • Total de contactos: ${contacts.length}`);
    console.log(`   • Contacto más reciente: ${contacts[0]?.createdAt.toLocaleString('es-AR')}`);
    console.log(`   • Contacto más antiguo: ${contacts[contacts.length - 1]?.createdAt.toLocaleString('es-AR')}`);
    
    // Categorizar contactos por tipo
    const categories = {
      presupuesto: contacts.filter(c => c.message.includes('Solicitud de presupuesto')).length,
      hogar: contacts.filter(c => c.message.includes('Hogar Inteligente')).length,
      vendedor: contacts.filter(c => c.message.includes('Productos:') || c.message.includes('Consulta de Producto')).length,
      general: contacts.filter(c => !c.message.includes('Solicitud de presupuesto') && !c.message.includes('Hogar Inteligente') && !c.message.includes('Productos:')).length
    };
    
    console.log('\n📊 Distribución por tipo:');
    console.log(`   • Solicitudes de presupuesto: ${categories.presupuesto}`);
    console.log(`   • Consultas de Hogar Inteligente: ${categories.hogar}`);
    console.log(`   • Contactos con vendedor: ${categories.vendedor}`);
    console.log(`   • Consultas generales: ${categories.general}`);
    
    console.log('\n💡 Para ver estos contactos en la web:');
    console.log('   • Ve a: http://localhost:3000/admin/contacts');
    console.log('   • O ejecuta: npm run dev y navega al panel de admin');
    
  } catch (error) {
    console.error('❌ Error al obtener contactos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showContacts(); 