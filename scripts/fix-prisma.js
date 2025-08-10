const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Arreglando cliente de Prisma...\n');

try {
  // 1. Eliminar carpeta .prisma si existe
  const prismaPath = path.join(process.cwd(), 'node_modules', '.prisma');
  if (fs.existsSync(prismaPath)) {
    console.log('🗑️  Eliminando carpeta .prisma...');
    fs.rmSync(prismaPath, { recursive: true, force: true });
    console.log('✅ Carpeta .prisma eliminada');
  }

  // 2. Eliminar archivo prisma client si existe
  const clientPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');
  if (fs.existsSync(clientPath)) {
    console.log('🗑️  Eliminando cliente de Prisma...');
    fs.rmSync(clientPath, { recursive: true, force: true });
    console.log('✅ Cliente de Prisma eliminado');
  }

  // 3. Regenerar cliente
  console.log('\n🔄 Regenerando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Cliente de Prisma regenerado');

  // 4. Verificar que funciona
  console.log('\n🧪 Probando conexión...');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  const testConnection = async () => {
    await prisma.$connect();
    const count = await prisma.service.count();
    console.log(`✅ Conexión exitosa - ${count} servicios encontrados`);
    await prisma.$disconnect();
  };
  
  testConnection();

  console.log('\n🎉 ¡Problema de Prisma resuelto!');
  console.log('💡 Ahora puedes ejecutar: npm run dev');

} catch (error) {
  console.error('❌ Error:', error.message);
  
  console.log('\n💡 Soluciones alternativas:');
  console.log('   1. Cerrar VS Code y abrir como administrador');
  console.log('   2. Ejecutar: npm install @prisma/client');
  console.log('   3. Ejecutar: npx prisma generate --force');
  console.log('   4. Reiniciar el terminal');
}
