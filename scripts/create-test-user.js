/**
 * Script para crear un usuario de prueba
 * Uso: node scripts/create-test-user.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log("👤 Creando usuario de prueba...");

    // Verificar si ya existe
    const existingUser = await prisma.user.findUnique({
      where: { id: "test-user-id" }
    });

    if (existingUser) {
      console.log("✅ Usuario de prueba ya existe");
      return existingUser;
    }

    // Crear usuario de prueba
    const user = await prisma.user.create({
      data: {
        id: "test-user-id",
        email: "test@example.com",
        password: "hashedpassword123",
        name: "Usuario de Prueba",
        role: "USER"
      }
    });

    console.log("✅ Usuario de prueba creado:", user.name);
    return user;

  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createTestUser(); 