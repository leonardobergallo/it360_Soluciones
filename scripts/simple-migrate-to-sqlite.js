const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Migración simple de Neon a SQLite...\n');

try {
  // 1. Restaurar schema de PostgreSQL temporalmente
  console.log('📋 1. Restaurando schema PostgreSQL...');
  if (fs.existsSync('./prisma/schema-postgresql.prisma')) {
    fs.copyFileSync('./prisma/schema-postgresql.prisma', './prisma/schema.prisma');
    console.log('   ✅ Schema PostgreSQL restaurado');
  }

  // 2. Generar cliente para PostgreSQL
  console.log('📋 2. Generando cliente PostgreSQL...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('   ✅ Cliente PostgreSQL generado');

  // 3. Crear script de migración directa
  console.log('📋 3. Creando script de migración directa...');
  
  const migrationScript = `
const { PrismaClient } = require('@prisma/client');

// Cliente para Neon (PostgreSQL)
const neonPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// Cliente para SQLite
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db'
    }
  }
});

async function migrateData() {
  console.log('🚀 Iniciando migración directa...');
  
  try {
    // Migrar Users
    console.log('📦 Migrando Users...');
    const users = await neonPrisma.user.findMany();
    console.log(\`   Encontrados \${users.length} usuarios\`);
    
    for (const user of users) {
      await sqlitePrisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user
      });
    }
    console.log('   ✅ Users migrados');

    // Migrar Products
    console.log('📦 Migrando Products...');
    const products = await neonPrisma.product.findMany();
    console.log(\`   Encontrados \${products.length} productos\`);
    
    for (const product of products) {
      await sqlitePrisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product
      });
    }
    console.log('   ✅ Products migrados');

    // Migrar Services
    console.log('📦 Migrando Services...');
    const services = await neonPrisma.service.findMany();
    console.log(\`   Encontrados \${services.length} servicios\`);
    
    for (const service of services) {
      await sqlitePrisma.service.upsert({
        where: { id: service.id },
        update: service,
        create: service
      });
    }
    console.log('   ✅ Services migrados');

    // Migrar Tickets
    console.log('📦 Migrando Tickets...');
    const tickets = await neonPrisma.ticket.findMany();
    console.log(\`   Encontrados \${tickets.length} tickets\`);
    
    for (const ticket of tickets) {
      await sqlitePrisma.ticket.upsert({
        where: { id: ticket.id },
        update: ticket,
        create: ticket
      });
    }
    console.log('   ✅ Tickets migrados');

    console.log('\\n🎉 ¡Migración completada!');
    console.log(\`📊 Total migrado: \${users.length} users, \${products.length} products, \${services.length} services, \${tickets.length} tickets\`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await neonPrisma.$disconnect();
    await sqlitePrisma.$disconnect();
  }
}

migrateData();
`;

  fs.writeFileSync('./temp-migration.js', migrationScript);
  console.log('   ✅ Script de migración creado');

  // 4. Ejecutar migración
  console.log('📋 4. Ejecutando migración...');
  execSync('node temp-migration.js', { stdio: 'inherit' });

  // 5. Limpiar archivos temporales
  console.log('📋 5. Limpiando archivos temporales...');
  if (fs.existsSync('./temp-migration.js')) {
    fs.unlinkSync('./temp-migration.js');
  }
  console.log('   ✅ Archivos temporales eliminados');

  // 6. Restaurar schema SQLite
  console.log('📋 6. Restaurando schema SQLite...');
  if (fs.existsSync('./prisma/schema-sqlite.prisma')) {
    fs.copyFileSync('./prisma/schema-sqlite.prisma', './prisma/schema.prisma');
    console.log('   ✅ Schema SQLite restaurado');
  }

  // 7. Generar cliente final para SQLite
  console.log('📋 7. Generando cliente SQLite final...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('   ✅ Cliente SQLite generado');

  console.log('\n🎉 ¡Migración completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Cambia DATABASE_URL en .env a: file:./dev.db');
  console.log('2. Reinicia el servidor: npm run dev');
  console.log('3. Tu base de datos SQLite está lista en: ./dev.db');

} catch (error) {
  console.error('❌ Error durante la migración:', error);
  
  // Restaurar schema SQLite en caso de error
  if (fs.existsSync('./prisma/schema-sqlite.prisma')) {
    fs.copyFileSync('./prisma/schema-sqlite.prisma', './prisma/schema.prisma');
    console.log('🔄 Schema SQLite restaurado');
  }
} 