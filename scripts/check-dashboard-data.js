const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndPopulateDashboardData() {
  try {
    console.log('🔍 Verificando datos del dashboard...\n');

    // Verificar usuarios
    const users = await prisma.user.findMany();
    console.log(`👥 Usuarios encontrados: ${users.length}`);
    
    if (users.length === 0) {
      console.log('⚠️ No hay usuarios. Creando usuarios de prueba...');
      
      const testUsers = [
        {
          email: 'admin@it360.com',
          password: await bcrypt.hash('admin123', 10),
          name: 'Administrador IT360',
          role: 'ADMIN'
        },
        {
          email: 'tecnico@it360.com',
          password: await bcrypt.hash('tecnico123', 10),
          name: 'Sofía López',
          role: 'TECNICO'
        },
        {
          email: 'cliente1@it360.com',
          password: await bcrypt.hash('cliente123', 10),
          name: 'Carlos Pérez',
          role: 'USER'
        },
        {
          email: 'cliente2@it360.com',
          password: await bcrypt.hash('cliente123', 10),
          name: 'María García',
          role: 'USER'
        }
      ];

      for (const user of testUsers) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: user
        });
      }
      console.log('✅ Usuarios de prueba creados');
    }

    // Verificar productos
    const products = await prisma.product.findMany();
    console.log(`📦 Productos encontrados: ${products.length}`);
    
    if (products.length === 0) {
      console.log('⚠️ No hay productos. Creando productos de prueba...');
      
      const testProducts = [
        {
          name: 'Laptop HP Pavilion',
          description: 'Laptop de alto rendimiento para trabajo y gaming',
          price: 1200.00,
          stock: 10,
          category: 'Computadoras',
          image: '/servicio-pc.png'
        },
        {
          name: 'Mouse Gaming RGB',
          description: 'Mouse inalámbrico con iluminación RGB personalizable',
          price: 45.00,
          stock: 25,
          category: 'Periféricos',
          image: '/servicio-productos.png'
        },
        {
          name: 'Teclado Mecánico',
          description: 'Teclado mecánico con switches Cherry MX',
          price: 120.00,
          stock: 15,
          category: 'Periféricos',
          image: '/servicio-software.png'
        },
        {
          name: 'Monitor 24" Full HD',
          description: 'Monitor LED de 24 pulgadas con resolución Full HD',
          price: 180.00,
          stock: 8,
          category: 'Monitores',
          image: '/servicio-pc.png'
        },
        {
          name: 'Auriculares Bluetooth',
          description: 'Auriculares inalámbricos con cancelación de ruido',
          price: 85.00,
          stock: 20,
          category: 'Audio',
          image: '/servicio-productos.png'
        }
      ];

      for (const product of testProducts) {
        await prisma.product.upsert({
          where: { name: product.name },
          update: {},
          create: product
        });
      }
      console.log('✅ Productos de prueba creados');
    }

    // Verificar servicios
    const services = await prisma.service.findMany();
    console.log(`🔧 Servicios encontrados: ${services.length}`);
    
    if (services.length === 0) {
      console.log('⚠️ No hay servicios. Creando servicios de prueba...');
      
      const testServices = [
        {
          name: 'Desarrollo Web Corporativo',
          description: 'Sitios web empresariales a medida con diseño responsivo',
          price: 2500.00
        },
        {
          name: 'Soporte Técnico Integral',
          description: 'Asistencia remota y presencial para empresas',
          price: 800.00
        },
        {
          name: 'Consultoría en Ciberseguridad',
          description: 'Auditoría y protección de sistemas informáticos',
          price: 3200.00
        },
        {
          name: 'Mantenimiento de Redes',
          description: 'Instalación y mantenimiento de redes empresariales',
          price: 1500.00
        },
        {
          name: 'Desarrollo de Aplicaciones',
          description: 'Aplicaciones móviles y de escritorio personalizadas',
          price: 4000.00
        }
      ];

      for (const service of testServices) {
        await prisma.service.upsert({
          where: { name: service.name },
          update: {},
          create: service
        });
      }
      console.log('✅ Servicios de prueba creados');
    }

    // Verificar contactos
    const contacts = await prisma.contact.findMany();
    console.log(`📞 Contactos encontrados: ${contacts.length}`);
    
    if (contacts.length === 0) {
      console.log('⚠️ No hay contactos. Creando contactos de prueba...');
      
      const testContacts = [
        {
          name: 'Juan Pérez',
          email: 'juan.perez@empresa.com',
          message: 'Hola, necesito información sobre servicios de desarrollo web para mi empresa.'
        },
        {
          name: 'Ana Rodríguez',
          email: 'ana.rodriguez@gmail.com',
          message: 'Buenos días, estoy interesada en el soporte técnico para mi oficina.'
        },
        {
          name: 'Carlos López',
          email: 'carlos.lopez@startup.com',
          message: 'Quisiera cotizar un proyecto de aplicación móvil para mi startup.'
        }
      ];

      for (const contact of testContacts) {
        await prisma.contact.upsert({
          where: { email: contact.email },
          update: {},
          create: contact
        });
      }
      console.log('✅ Contactos de prueba creados');
    }

    // Verificar ventas
    const sales = await prisma.sale.findMany();
    console.log(`💰 Ventas encontradas: ${sales.length}`);
    
    if (sales.length === 0 && users.length > 0 && (products.length > 0 || services.length > 0)) {
      console.log('⚠️ No hay ventas. Creando ventas de prueba...');
      
      const firstUser = users[0];
      const firstProduct = products[0];
      const firstService = services[0];

      if (firstProduct) {
        await prisma.sale.create({
          data: {
            userId: firstUser.id,
            productId: firstProduct.id,
            amount: firstProduct.price,
            nombre: 'Cliente Ejemplo',
            email: 'cliente@ejemplo.com',
            telefono: '123456789',
            direccion: 'Dirección de ejemplo',
            status: 'completed'
          }
        });
      }

      if (firstService) {
        await prisma.sale.create({
          data: {
            userId: firstUser.id,
            serviceId: firstService.id,
            amount: firstService.price,
            nombre: 'Cliente Servicio',
            email: 'servicio@ejemplo.com',
            telefono: '987654321',
            direccion: 'Dirección de servicio',
            status: 'pending'
          }
        });
      }
      console.log('✅ Ventas de prueba creadas');
    }

    // Resumen final
    console.log('\n📊 RESUMEN DEL DASHBOARD:');
    console.log('='.repeat(40));
    
    const finalUsers = await prisma.user.findMany();
    const finalProducts = await prisma.product.findMany();
    const finalServices = await prisma.service.findMany();
    const finalContacts = await prisma.contact.findMany();
    const finalSales = await prisma.sale.findMany();

    const admins = finalUsers.filter(u => u.role === 'ADMIN').length;
    const tecnicos = finalUsers.filter(u => u.role === 'TECNICO').length;
    const clientes = finalUsers.filter(u => u.role === 'USER').length;

    console.log(`👥 Total Usuarios: ${finalUsers.length}`);
    console.log(`   👑 Administradores: ${admins}`);
    console.log(`   🔧 Técnicos: ${tecnicos}`);
    console.log(`   👤 Clientes: ${clientes}`);
    console.log(`📦 Productos: ${finalProducts.length}`);
    console.log(`🔧 Servicios: ${finalServices.length}`);
    console.log(`💰 Ventas: ${finalSales.length}`);
    console.log(`📞 Contactos: ${finalContacts.length}`);

    console.log('\n✅ Dashboard listo para usar!');
    console.log('\n🔐 CREDENCIALES DE ACCESO:');
    console.log('='.repeat(40));
    console.log('👑 ADMIN: admin@it360.com / admin123');
    console.log('🔧 TÉCNICO: tecnico@it360.com / tecnico123');
    console.log('👤 CLIENTE: cliente1@it360.com / cliente123');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndPopulateDashboardData(); 