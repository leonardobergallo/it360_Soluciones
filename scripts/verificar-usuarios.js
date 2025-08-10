import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function verificarUsuarios() {
  console.log('👥 Verificando usuarios en la base de datos...\n');

  try {
    // Obtener todos los usuarios
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log(`👥 Encontrados ${usuarios.length} usuarios:`);
    usuarios.forEach((usuario, index) => {
      console.log(`${index + 1}. ${usuario.name} (${usuario.email})`);
      console.log(`   • Rol: ${usuario.role}`);
      console.log(`   • Creado: ${usuario.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // Buscar usuario específico del ticket
    const emailTicket = 'leonardobergallo@gmail.com';
    console.log(`🔍 Buscando usuario con email: ${emailTicket}`);
    
    const usuarioEncontrado = await prisma.user.findUnique({
      where: { email: emailTicket }
    });

    if (usuarioEncontrado) {
      console.log(`✅ Usuario encontrado: ${usuarioEncontrado.name} (${usuarioEncontrado.email})`);
      
      // Verificar carrito
      const carrito = await prisma.cart.findUnique({
        where: { userId: usuarioEncontrado.id },
        include: { items: { include: { product: true } } }
      });

      if (carrito && carrito.items.length > 0) {
        console.log(`🛒 Carrito encontrado con ${carrito.items.length} productos:`);
        carrito.items.forEach(item => {
          console.log(`   • ${item.product.name} - Cantidad: ${item.quantity}`);
        });
      } else {
        console.log('🛒 Carrito vacío o no encontrado');
      }
    } else {
      console.log('❌ Usuario no encontrado');
      
      // Buscar usuarios similares
      const usuariosSimilares = await prisma.user.findMany({
        where: {
          email: {
            contains: 'leonardo',
            mode: 'insensitive'
          }
        }
      });

      if (usuariosSimilares.length > 0) {
        console.log('🔍 Usuarios similares encontrados:');
        usuariosSimilares.forEach(u => {
          console.log(`   • ${u.name} (${u.email})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarUsuarios();
