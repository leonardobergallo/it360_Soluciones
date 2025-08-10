import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function crearUsuarioTicket() {
  console.log('👤 Creando usuario para el ticket...\n');

  try {
    const email = 'leonardobergallo@gmail.com';
    const nombre = 'Leonardo Bergallo';
    const password = '123456'; // Contraseña temporal

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      console.log(`✅ Usuario ya existe: ${usuarioExistente.name} (${usuarioExistente.email})`);
      return;
    }

    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const nuevoUsuario = await prisma.user.create({
      data: {
        name: nombre,
        email: email,
        password: hashedPassword,
        role: 'USER'
      }
    });

    console.log(`✅ Usuario creado exitosamente:`);
    console.log(`   • Nombre: ${nuevoUsuario.name}`);
    console.log(`   • Email: ${nuevoUsuario.email}`);
    console.log(`   • Rol: ${nuevoUsuario.role}`);
    console.log(`   • ID: ${nuevoUsuario.id}`);

    // Crear carrito vacío para el usuario
    const carrito = await prisma.cart.create({
      data: { userId: nuevoUsuario.id }
    });

    console.log(`🛒 Carrito creado: ${carrito.id}`);

    console.log('\n💡 Ahora puedes probar el sistema completo');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

crearUsuarioTicket();
