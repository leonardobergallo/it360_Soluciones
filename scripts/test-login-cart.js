const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testLoginAndCart() {
  console.log('🧪 Probando login y carrito...\n');

  try {
    // 1. Buscar un usuario existente
    const user = await prisma.user.findFirst({
      where: { email: 'cliente1@it360.com' }
    });

    if (!user) {
      console.log('❌ Usuario cliente1@it360.com no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.name}`);

    // 2. Generar token JWT (simulando el login)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024',
      { expiresIn: '24h' }
    );

    console.log(`\n🔑 Token generado:`);
    console.log(`   ${token.substring(0, 50)}...`);

    // 3. Verificar el token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024');
    console.log(`\n🔍 Token decodificado:`);
    console.log(`   userId: ${decoded.userId}`);
    console.log(`   email: ${decoded.email}`);
    console.log(`   role: ${decoded.role}`);

    // 4. Verificar que el userId del token existe en la base de datos
    const userFromToken = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!userFromToken) {
      console.log(`\n❌ ERROR: El userId del token (${decoded.userId}) no existe en la base de datos`);
      return;
    }

    console.log(`\n✅ Usuario del token verificado:`);
    console.log(`   ID: ${userFromToken.id}`);
    console.log(`   Email: ${userFromToken.email}`);

    // 5. Intentar crear un carrito
    console.log(`\n🛒 Intentando crear carrito para userId: ${decoded.userId}`);

    // Verificar si ya existe un carrito
    let cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId }
    });

    if (cart) {
      console.log(`✅ Carrito ya existe:`);
      console.log(`   ID: ${cart.id}`);
      console.log(`   Usuario: ${cart.userId}`);
    } else {
      // Crear nuevo carrito
      cart = await prisma.cart.create({
        data: { userId: decoded.userId }
      });
      console.log(`✅ Carrito creado exitosamente:`);
      console.log(`   ID: ${cart.id}`);
      console.log(`   Usuario: ${cart.userId}`);
    }

    console.log('\n🎉 ¡Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    
    if (error.code === 'P2003') {
      console.log('\n💡 El error P2003 indica que el userId no existe en la tabla User');
      console.log('   Verifica que el token contenga un userId válido');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testLoginAndCart(); 