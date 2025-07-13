const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testHttpCart() {
  console.log('🧪 Probando carrito con peticiones HTTP reales...\n');

  try {
    // 1. Buscar usuario
    const user = await prisma.user.findFirst({
      where: { email: 'cliente1@it360.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario: ${user.email} (ID: ${user.id})`);

    // 2. Generar token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024',
      { expiresIn: '24h' }
    );

    console.log(`🔑 Token: ${token.substring(0, 50)}...`);

    // 3. Probar GET /api/cart
    console.log('\n📡 Probando GET /api/cart...');
    
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Carrito obtenido:`);
        console.log(`      ID: ${data.id}`);
        console.log(`      User ID: ${data.userId}`);
        console.log(`      Items: ${data.items?.length || 0}`);
      } else {
        const errorData = await response.text();
        console.log(`   ❌ Error: ${errorData}`);
      }
    } catch (error) {
      console.log(`   ❌ Error de red: ${error.message}`);
    }

    // 4. Buscar producto para agregar
    const product = await prisma.product.findFirst();
    if (!product) {
      console.log('\n❌ No hay productos para probar');
      return;
    }

    console.log(`\n📦 Producto: ${product.name} (ID: ${product.id})`);

    // 5. Probar POST /api/cart
    console.log('\n📡 Probando POST /api/cart...');
    
    try {
      const response = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      });

      console.log(`   Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Producto agregado:`);
        console.log(`      Items en carrito: ${data.items?.length || 0}`);
      } else {
        const errorData = await response.text();
        console.log(`   ❌ Error: ${errorData}`);
      }
    } catch (error) {
      console.log(`   ❌ Error de red: ${error.message}`);
    }

    console.log('\n🎉 ¡Prueba completada!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Verificar que el servidor esté corriendo
console.log('⚠️  Asegúrate de que el servidor esté corriendo en http://localhost:3000');
console.log('   Ejecuta: npm run dev\n');

testHttpCart(); 