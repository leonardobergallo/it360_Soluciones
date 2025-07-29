const { PrismaClient } = require('@prisma/client');

console.log('🔧 Debuggeando servicios...\n');

async function debugServices() {
  const prisma = new PrismaClient();
  
  try {
    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos SQLite\n');
    
    // Obtener todos los servicios activos
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });
    
    console.log(`📊 Total de servicios encontrados: ${services.length}\n`);
    
    if (services.length === 0) {
      console.log('❌ No hay servicios en la base de datos');
      return;
    }
    
    // Mostrar cada servicio con detalles
    services.forEach((service, index) => {
      console.log(`🔧 Servicio #${index + 1}`);
      console.log('='.repeat(50));
      console.log(`📝 Nombre: ${service.name}`);
      console.log(`💰 Precio: $${service.price}`);
      console.log(`📄 Descripción: ${service.description}`);
      console.log(`📊 Orden: ${service.order}`);
      console.log(`🆔 ID: ${service.id}`);
      console.log(`📅 Creado: ${service.createdAt.toLocaleString('es-AR')}`);
      console.log('='.repeat(50));
      console.log('');
    });
    
    // Estadísticas
    console.log('📈 Estadísticas de servicios:');
    console.log(`   • Total de servicios: ${services.length}`);
    console.log(`   • Precio mínimo: $${Math.min(...services.map(s => s.price))}`);
    console.log(`   • Precio máximo: $${Math.max(...services.map(s => s.price))}`);
    console.log(`   • Precio promedio: $${(services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(2)}`);
    
    // Servicios por rango de precio
    const serviciosGratis = services.filter(s => s.price === 0).length;
    const serviciosEconomicos = services.filter(s => s.price > 0 && s.price <= 100).length;
    const serviciosMedios = services.filter(s => s.price > 100 && s.price <= 500).length;
    const serviciosPremium = services.filter(s => s.price > 500).length;
    
    console.log('\n💰 Distribución por precio:');
    console.log(`   • Gratuitos: ${serviciosGratis}`);
    console.log(`   • Económicos ($1-$100): ${serviciosEconomicos}`);
    console.log(`   • Medios ($101-$500): ${serviciosMedios}`);
    console.log(`   • Premium ($501+): ${serviciosPremium}`);
    
    console.log('\n💡 Para ver estos servicios en la web:');
    console.log('   • Ve a: http://localhost:3000');
    console.log('   • O ejecuta: npm run dev y navega a la página principal');
    
  } catch (error) {
    console.error('❌ Error al obtener servicios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugServices(); 