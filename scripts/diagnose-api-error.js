const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseApiError() {
  try {
    console.log('🔍 Diagnosticando error de API...\n');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos\n');

    // Probar consulta simple
    console.log('🧪 Probando consulta simple...');
    const count = await prisma.service.count();
    console.log(`   • Total de servicios: ${count}\n`);

    // Probar consulta con ordenamiento
    console.log('🧪 Probando consulta con ordenamiento...');
    try {
      const servicesWithOrder = await prisma.service.findMany({
        orderBy: { order: 'asc' }
      });
      console.log(`   • Servicios con orden: ${servicesWithOrder.length}`);
      
      // Verificar si todos tienen el campo 'order'
      const servicesWithoutOrder = servicesWithOrder.filter(s => s.order === null || s.order === undefined);
      if (servicesWithoutOrder.length > 0) {
        console.log(`   ⚠️  ${servicesWithoutOrder.length} servicios sin campo 'order'`);
      } else {
        console.log('   ✅ Todos los servicios tienen campo order');
      }
    } catch (orderError) {
      console.log(`   ❌ Error con ordenamiento: ${orderError.message}`);
    }

    // Probar consulta con filtro active
    console.log('\n🧪 Probando consulta con filtro active...');
    try {
      const activeServices = await prisma.service.findMany({
        where: { active: true }
      });
      console.log(`   • Servicios activos: ${activeServices.length}`);
    } catch (activeError) {
      console.log(`   ❌ Error con filtro active: ${activeError.message}`);
    }

    // Verificar estructura de la tabla
    console.log('\n🔧 Verificando estructura de la tabla...');
    try {
      const tableInfo = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'service' 
        ORDER BY ordinal_position;
      `;
      
      console.log('📊 Estructura de la tabla Service:');
      tableInfo.forEach(col => {
        console.log(`   • ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${col.column_default ? `[default: ${col.column_default}]` : ''}`);
      });

      // Verificar si faltan columnas
      const requiredColumns = ['id', 'name', 'description', 'price', 'active', 'order'];
      const existingColumns = tableInfo.map(col => col.column_name);
      
      console.log('\n🔍 Verificando columnas requeridas:');
      requiredColumns.forEach(col => {
        if (existingColumns.includes(col)) {
          console.log(`   ✅ ${col}`);
        } else {
          console.log(`   ❌ ${col} - FALTA`);
        }
      });

    } catch (structureError) {
      console.log(`   ❌ Error verificando estructura: ${structureError.message}`);
    }

    // Probar consulta completa como la API
    console.log('\n🧪 Probando consulta completa (como la API)...');
    try {
      const allServices = await prisma.service.findMany({
        orderBy: { order: 'asc' }
      });
      console.log(`   ✅ Consulta exitosa: ${allServices.length} servicios`);
      
      // Mostrar primeros 3 servicios
      console.log('\n📋 Primeros 3 servicios:');
      allServices.slice(0, 3).forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.name} - $${service.price} - Order: ${service.order || 'N/A'}`);
      });

    } catch (apiError) {
      console.log(`   ❌ Error en consulta API: ${apiError.message}`);
      console.log(`   📝 Stack trace: ${apiError.stack}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verificar DATABASE_URL en .env.local');
    console.log('   2. Ejecutar: npx prisma generate');
    console.log('   3. Ejecutar: npx prisma migrate dev');
    console.log('   4. Verificar conexión a la base de datos');
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseApiError();
