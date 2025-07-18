const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportUsers() {
  try {
    console.log('📤 Exportando usuarios a archivo...\n');
    
    // Obtener todos los usuarios
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    if (allUsers.length === 0) {
      console.log('❌ No hay usuarios para exportar.');
      return;
    }

    // Crear contenido del archivo
    let content = '🔐 USUARIOS IT360 SOLUCIONES\n';
    content += '='.repeat(50) + '\n';
    content += `Fecha de exportación: ${new Date().toLocaleString('es-AR')}\n`;
    content += `Total de usuarios: ${allUsers.length}\n\n`;

    // Agrupar usuarios por rol
    const usersByRole = {
      ADMIN: allUsers.filter(user => user.role === 'ADMIN'),
      TECNICO: allUsers.filter(user => user.role === 'TECNICO'),
      USER: allUsers.filter(user => user.role === 'USER')
    };

    // Agregar administradores
    if (usersByRole.ADMIN.length > 0) {
      content += '👑 ADMINISTRADORES:\n';
      content += '='.repeat(30) + '\n';
      usersByRole.ADMIN.forEach((user, index) => {
        content += `\n${index + 1}. ${user.name}\n`;
        content += `   Email: ${user.email}\n`;
        content += `   Contraseña: ${user.password}\n`;
        content += `   Creado: ${user.createdAt.toLocaleDateString('es-AR')}\n`;
        content += '   ' + '-'.repeat(25) + '\n';
      });
    }

    // Agregar técnicos
    if (usersByRole.TECNICO.length > 0) {
      content += '\n👨‍💻 TÉCNICOS:\n';
      content += '='.repeat(30) + '\n';
      usersByRole.TECNICO.forEach((user, index) => {
        content += `\n${index + 1}. ${user.name}\n`;
        content += `   Email: ${user.email}\n`;
        content += `   Contraseña: ${user.password}\n`;
        content += `   Creado: ${user.createdAt.toLocaleDateString('es-AR')}\n`;
        content += '   ' + '-'.repeat(25) + '\n';
      });
    }

    // Agregar clientes
    if (usersByRole.USER.length > 0) {
      content += '\n👤 CLIENTES:\n';
      content += '='.repeat(30) + '\n';
      usersByRole.USER.forEach((user, index) => {
        content += `\n${index + 1}. ${user.name}\n`;
        content += `   Email: ${user.email}\n`;
        content += `   Contraseña: ${user.password}\n`;
        content += `   Creado: ${user.createdAt.toLocaleDateString('es-AR')}\n`;
        content += '   ' + '-'.repeat(25) + '\n';
      });
    }

    // Agregar resumen para login rápido
    content += '\n🚀 RESUMEN PARA LOGIN RÁPIDO:\n';
    content += '='.repeat(30) + '\n';
    
    if (usersByRole.ADMIN.length > 0) {
      const admin = usersByRole.ADMIN[0];
      content += `\n👑 ADMIN (Panel de administración):\n`;
      content += `   Email: ${admin.email}\n`;
      content += `   Contraseña: ${admin.password}\n`;
    }
    
    if (usersByRole.TECNICO.length > 0) {
      const tecnico = usersByRole.TECNICO[0];
      content += `\n👨‍💻 TÉCNICO (Panel técnico):\n`;
      content += `   Email: ${tecnico.email}\n`;
      content += `   Contraseña: ${tecnico.password}\n`;
    }
    
    if (usersByRole.USER.length > 0) {
      const cliente = usersByRole.USER[0];
      content += `\n👤 CLIENTE (Acceso normal):\n`;
      content += `   Email: ${cliente.email}\n`;
      content += `   Contraseña: ${cliente.password}\n`;
    }

    // Agregar estadísticas
    content += '\n📊 ESTADÍSTICAS:\n';
    content += '='.repeat(30) + '\n';
    content += `• Total de usuarios: ${allUsers.length}\n`;
    content += `• Administradores: ${usersByRole.ADMIN.length}\n`;
    content += `• Técnicos: ${usersByRole.TECNICO.length}\n`;
    content += `• Clientes: ${usersByRole.USER.length}\n`;

    // Agregar tips
    content += '\n💡 TIPS:\n';
    content += '='.repeat(30) + '\n';
    content += '• Usa ADMIN para acceder al panel de administración\n';
    content += '• Usa TÉCNICO para acceder al panel técnico\n';
    content += '• Usa CLIENTE para acceder normal al sitio\n';
    content += '• URL de login: /login\n';

    // Crear nombre del archivo con fecha
    const date = new Date().toISOString().split('T')[0];
    const fileName = `usuarios-it360-${date}.txt`;
    const filePath = path.join(__dirname, fileName);

    // Escribir archivo
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`✅ Usuarios exportados exitosamente a: ${fileName}`);
    console.log(`📁 Ubicación: ${filePath}`);
    console.log(`📊 Total de usuarios exportados: ${allUsers.length}`);

    // Mostrar resumen en consola
    console.log('\n📋 RESUMEN DE EXPORTACIÓN:');
    console.log('='.repeat(40));
    console.log(`• Administradores: ${usersByRole.ADMIN.length}`);
    console.log(`• Técnicos: ${usersByRole.TECNICO.length}`);
    console.log(`• Clientes: ${usersByRole.USER.length}`);
    console.log(`• Archivo creado: ${fileName}`);

  } catch (error) {
    console.error('❌ Error al exportar usuarios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
exportUsers(); 