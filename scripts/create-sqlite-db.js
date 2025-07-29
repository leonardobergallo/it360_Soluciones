const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('🚀 Creando base de datos SQLite...\n');

async function createSQLiteDB() {
  let prisma;
  try {
    // Verificar que el schema SQLite esté configurado
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    if (!schemaContent.includes('provider = "sqlite"')) {
      console.log('❌ Error: El schema no está configurado para SQLite');
      console.log('Ejecuta: npm run switch-to-sqlite');
      return;
    }
    
    console.log('📋 Schema SQLite verificado');
    
    // Crear cliente Prisma
    prisma = new PrismaClient();
    
    // Intentar conectar para crear la base de datos
    console.log('📋 Conectando a SQLite...');
    await prisma.$connect();
    console.log('   ✅ Conexión exitosa');
    
    // Crear algunas tablas de prueba
    console.log('📋 Creando tablas de prueba...');
    
    // Crear un usuario de prueba (con manejo de duplicados)
    let testUser;
    try {
      testUser = await prisma.user.create({
        data: {
          email: 'admin@it360.com',
          password: 'admin123',
          name: 'Administrador',
          role: 'ADMIN'
        }
      });
      console.log('   ✅ Usuario de prueba creado');
    } catch (userError) {
      if (userError.code === 'P2002') {
        console.log('   ⚠️ Usuario de prueba ya existe');
        testUser = await prisma.user.findUnique({
          where: { email: 'admin@it360.com' }
        });
      } else {
        throw userError;
      }
    }
    
    // Crear un producto de prueba
    let testProduct;
    try {
      testProduct = await prisma.product.create({
        data: {
          name: 'Producto de Prueba',
          description: 'Descripción del producto de prueba',
          price: 99.99,
          stock: 10,
          category: 'Electrónicos'
        }
      });
      console.log('   ✅ Producto de prueba creado');
    } catch (productError) {
      if (productError.code === 'P2002') {
        console.log('   ⚠️ Producto de prueba ya existe');
        testProduct = await prisma.product.findUnique({
          where: { name: 'Producto de Prueba' }
        });
      } else {
        throw productError;
      }
    }
    
    // Crear un servicio de prueba
    let testService;
    try {
      testService = await prisma.service.create({
        data: {
          name: 'Servicio de Prueba',
          description: 'Descripción del servicio de prueba',
          price: 149.99
        }
      });
      console.log('   ✅ Servicio de prueba creado');
    } catch (serviceError) {
      if (serviceError.code === 'P2002') {
        console.log('   ⚠️ Servicio de prueba ya existe');
        testService = await prisma.service.findUnique({
          where: { name: 'Servicio de Prueba' }
        });
      } else {
        throw serviceError;
      }
    }
    
    console.log('\n🎉 ¡Base de datos SQLite creada exitosamente!');
    console.log('📊 Datos de prueba creados:');
    console.log(`   - Usuario: ${testUser.email}`);
    console.log(`   - Producto: ${testProduct.name}`);
    console.log(`   - Servicio: ${testService.name}`);
    
    console.log('\n💾 Base de datos ubicada en: ./dev.db');
    console.log('🔧 Ahora puedes ejecutar: npm run dev');
    
  } catch (error) {
    console.error('❌ Error creando la base de datos:', error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

createSQLiteDB(); 