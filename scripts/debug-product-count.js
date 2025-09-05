const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugProductCount() {
  try {
    console.log('🔍 INVESTIGANDO CUENTA DE PRODUCTOS...\n');

    // 1. Contar todos los productos sin filtros
    const allProducts = await prisma.product.findMany();
    console.log(`📦 Total de productos en la base de datos: ${allProducts.length}`);

    // 2. Contar productos activos vs inactivos
    const activeProducts = await prisma.product.findMany({
      where: { active: true }
    });
    
    const inactiveProducts = await prisma.product.findMany({
      where: { active: false }
    });

    console.log(`✅ Productos activos: ${activeProducts.length}`);
    console.log(`❌ Productos inactivos: ${inactiveProducts.length}`);

    // 3. Verificar si hay productos con campos nulos o undefined
    const productsWithNullFields = allProducts.filter(p => 
      !p.name || !p.description || p.price === null || p.price === undefined
    );

    console.log(`⚠️  Productos con campos nulos: ${productsWithNullFields.length}`);

    // 4. Mostrar algunos ejemplos de productos
    console.log('\n📋 EJEMPLOS DE PRODUCTOS:');
    console.log('=' .repeat(50));
    
    allProducts.slice(0, 10).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name || 'SIN NOMBRE'}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Activo: ${product.active}`);
      console.log(`   Categoría: ${product.category || 'SIN CATEGORÍA'}`);
      console.log(`   Precio: ${product.price || 'SIN PRECIO'}`);
      console.log(`   Imagen: ${product.image || 'SIN IMAGEN'}`);
      console.log('');
    });

    // 5. Verificar si hay productos duplicados
    const productNames = allProducts.map(p => p.name).filter(name => name);
    const uniqueNames = [...new Set(productNames)];
    const duplicateNames = productNames.filter((name, index) => productNames.indexOf(name) !== index);

    console.log(`🔄 Nombres únicos: ${uniqueNames.length}`);
    console.log(`📝 Total de nombres: ${productNames.length}`);
    console.log(`🔄 Posibles duplicados: ${duplicateNames.length}`);

    // 6. Verificar la conexión a la base de datos
    console.log('\n🔌 VERIFICANDO CONEXIÓN A LA BASE DE DATOS:');
    console.log('=' .repeat(50));
    
    try {
      await prisma.$connect();
      console.log('✅ Conexión a la base de datos exitosa');
      
      // Verificar si es la base de datos correcta
      const dbInfo = await prisma.$queryRaw`SELECT current_database() as db_name, current_user as user_name`;
      console.log('📊 Información de la base de datos:', dbInfo);
      
    } catch (error) {
      console.error('❌ Error de conexión:', error.message);
    }

    // 7. Verificar si hay productos en otras tablas
    console.log('\n🔍 VERIFICANDO OTRAS TABLAS:');
    console.log('=' .repeat(50));
    
    try {
      const salesCount = await prisma.sale.count();
      const servicesCount = await prisma.service.count();
      const usersCount = await prisma.user.count();
      
      console.log(`🛒 Ventas: ${salesCount}`);
      console.log(`🔧 Servicios: ${servicesCount}`);
      console.log(`👥 Usuarios: ${usersCount}`);
      
    } catch (error) {
      console.error('❌ Error contando otras tablas:', error.message);
    }

    // 8. Verificar si hay productos con estado especial
    const productsByStatus = {};
    allProducts.forEach(product => {
      const status = product.active ? 'activo' : 'inactivo';
      if (!productsByStatus[status]) productsByStatus[status] = [];
      productsByStatus[status].push(product);
    });

    console.log('\n📊 PRODUCTOS POR ESTADO:');
    console.log('=' .repeat(30));
    
    Object.entries(productsByStatus).forEach(([status, products]) => {
      console.log(`${status}: ${products.length} productos`);
    });

    console.log('\n🎉 Debug completado!');

  } catch (error) {
    console.error('❌ Error durante el debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
debugProductCount();
