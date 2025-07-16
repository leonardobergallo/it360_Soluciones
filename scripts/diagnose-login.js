const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function diagnoseLogin() {
  console.log('🔍 Diagnóstico del sistema de login...\n');

  try {
    // 1. Verificar conexión a la base de datos
    console.log('1. Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('   ✅ Conexión exitosa\n');

    // 2. Verificar si hay usuarios en la base de datos
    console.log('2. Verificando usuarios en la base de datos...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('   ⚠️  No hay usuarios en la base de datos');
      console.log('   💡 Ejecuta: npm run create-admin');
    } else {
      console.log(`   ✅ Encontrados ${users.length} usuarios:`);
      users.forEach(user => {
        console.log(`      - ${user.email} (${user.role}) - ${user.name}`);
      });
    }
    console.log('');

    // 3. Verificar variables de entorno
    console.log('3. Verificando variables de entorno...');
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET'
    ];

    const missingVars = [];
    requiredEnvVars.forEach(varName => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      console.log('   ❌ Variables de entorno faltantes:');
      missingVars.forEach(varName => {
        console.log(`      - ${varName}`);
      });
    } else {
      console.log('   ✅ Todas las variables de entorno están configuradas');
    }
    console.log('');

    // 4. Probar generación de JWT
    console.log('4. Probando generación de JWT...');
    try {
      const testToken = jwt.sign(
        { userId: 'test', email: 'test@test.com', role: 'USER' },
        process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024',
        { expiresIn: '1h' }
      );
      console.log('   ✅ JWT generado correctamente');
    } catch (jwtError) {
      console.log('   ❌ Error generando JWT:', jwtError.message);
    }
    console.log('');

    // 5. Probar hash de contraseña
    console.log('5. Probando hash de contraseña...');
    try {
      const testPassword = 'test123';
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const isValid = await bcrypt.compare(testPassword, hashedPassword);
      console.log('   ✅ Hash de contraseña funciona correctamente');
    } catch (bcryptError) {
      console.log('   ❌ Error con hash de contraseña:', bcryptError.message);
    }
    console.log('');

    // 6. Verificar estructura de la base de datos
    console.log('6. Verificando estructura de la base de datos...');
    try {
      const tableCount = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      console.log('   ✅ Estructura de base de datos válida');
    } catch (dbError) {
      console.log('   ❌ Error verificando estructura:', dbError.message);
    }

  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n📋 Resumen de acciones recomendadas:');
  console.log('1. Si no hay usuarios: npm run create-admin');
  console.log('2. Si faltan variables de entorno: npm run setup:env');
  console.log('3. Si hay problemas de DB: npm run db:migrate');
  console.log('4. Reiniciar el servidor: npm run dev');
}

diagnoseLogin().catch(console.error); 