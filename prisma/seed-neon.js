const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Usuarios de ejemplo
  const users = [
    {
      id: 'bc2db4a9-ddd4-4d0a-8052-eaec54daa331',
      email: 'admin@it360.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin',
      role: 'ADMIN',
    },
    {
      id: 'b2b7e478-f562-4cec-8dd3-fecfd95ed13c',
      email: 'tecnico@it360.com',
      password: await bcrypt.hash('tecnico123', 10),
      name: 'Tecnico',
      role: 'TECNICO',
    },
    {
      id: 'e0499c3d-76d5-47b1-8eba-f1f976f33570',
      email: 'cliente1@it360.com',
      password: await bcrypt.hash('cliente123', 10),
      name: 'Cliente 1',
      role: 'USER',
    },
    {
      id: '7b97030f-90e6-4b16-8a13-b536f5675ebf',
      email: 'cliente2@it360.com',
      password: await bcrypt.hash('cliente123', 10),
      name: 'Cliente 2',
      role: 'USER',
    },
    {
      id: '11d79fe4-c833-46d9-b309-aaed1c07bd8d',
      email: 'test@it360.com',
      password: await bcrypt.hash('test123', 10),
      name: 'Usuario de Prueba',
      role: 'USER',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Productos de ejemplo
  const products = [
    {
      name: 'Laptop Lenovo ThinkPad',
      description: 'Laptop empresarial de alto rendimiento',
      price: 1200,
      stock: 10,
      image: 'https://dummyimage.com/600x400/000/fff&text=Lenovo+ThinkPad',
      category: 'Tecnología',
    },
    {
      name: 'Monitor Samsung 24"',
      description: 'Monitor LED Full HD',
      price: 250,
      stock: 20,
      image: 'https://dummyimage.com/600x400/000/fff&text=Samsung+24',
      category: 'Tecnología',
    },
    {
      name: 'Teclado Mecánico Logitech',
      description: 'Teclado mecánico retroiluminado',
      price: 100,
      stock: 15,
      image: 'https://dummyimage.com/600x400/000/fff&text=Logitech+Teclado',
      category: 'Accesorios',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  // Servicios de ejemplo
  const services = [
    {
      name: 'Desarrollo Web',
      description: 'Creación de sitios web a medida',
      price: 800,
    },
    {
      name: 'Soporte Técnico',
      description: 'Asistencia y mantenimiento de equipos',
      price: 100,
    },
    {
      name: 'Instalación de Redes',
      description: 'Configuración de redes empresariales',
      price: 500,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
  }

  console.log('✅ Usuarios, productos y servicios de prueba insertados en Neon/PostgreSQL');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 