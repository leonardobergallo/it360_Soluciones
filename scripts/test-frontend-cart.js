const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testFrontendCart() {
  console.log('🧪 Simulando peticiones del frontend al carrito...\n');

  try {
    // 1. Simular login exitoso
    const user = await prisma.user.findFirst({
      where: { email: 'cliente1@it360.com' }
    });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log(`✅ Usuario encontrado: ${user.email} (ID: ${user.id})`);

    // 2. Generar token (como lo hace el endpoint de login)
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024',
      { expiresIn: '24h' }
    );

    console.log(`🔑 Token generado: ${token.substring(0, 50)}...`);

    // 3. Simular petición GET al carrito (como CartIconWithBadge)
    console.log('\n📡 Simulando GET /api/cart...');
    
    // Crear una petición HTTP simulada
    const mockRequest = {
      headers: {
        get: (name) => {
          if (name === 'authorization') {
            return `Bearer ${token}`;
          }
          return null;
        }
      }
    };

    // Importar y usar la función del endpoint
    const { GET } = require('../app/api/cart/route.ts');
    
    try {
      const response = await GET(mockRequest);
      const data = await response.json();
      
      console.log('✅ GET /api/cart exitoso:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Cart ID: ${data.id}`);
      console.log(`   User ID: ${data.userId}`);
      console.log(`   Items: ${data.items?.length || 0}`);
      
    } catch (error) {
      console.error('❌ Error en GET /api/cart:', error);
    }

    // 4. Simular petición POST al carrito (como addToCart)
    console.log('\n📡 Simulando POST /api/cart...');
    
    // Buscar un producto para agregar
    const product = await prisma.product.findFirst();
    if (!product) {
      console.log('❌ No hay productos para probar');
      return;
    }

    console.log(`📦 Producto encontrado: ${product.name} (ID: ${product.id})`);

    const mockPostRequest = {
      headers: {
        get: (name) => {
          if (name === 'authorization') {
            return `Bearer ${token}`;
          }
          return null;
        }
      },
      json: async () => ({
        productId: product.id,
        quantity: 1
      })
    };

    try {
      const { POST } = require('../app/api/cart/route.ts');
      const response = await POST(mockPostRequest);
      const data = await response.json();
      
      console.log('✅ POST /api/cart exitoso:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Items en carrito: ${data.items?.length || 0}`);
      
    } catch (error) {
      console.error('❌ Error en POST /api/cart:', error);
    }

    console.log('\n🎉 ¡Prueba completada!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFrontendCart(); 