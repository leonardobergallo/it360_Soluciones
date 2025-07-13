const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Limpiar tablas en orden de dependencias
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.paymentPreference.deleteMany();

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

  const createdProducts = [];
  for (const product of products) {
    const p = await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
    createdProducts.push(p);
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

  const createdServices = [];
  for (const service of services) {
    const s = await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service,
    });
    createdServices.push(s);
  }

  // Ventas de ejemplo
  await prisma.sale.create({
    data: {
      userId: users[2].id, // cliente1
      productId: createdProducts[0].id,
      amount: createdProducts[0].price,
      status: 'completed',
      nombre: 'Cliente 1',
      email: 'cliente1@it360.com',
      metodoPago: 'tarjeta',
    }
  });
  await prisma.sale.create({
    data: {
      userId: users[2].id, // cliente1
      serviceId: createdServices[0].id,
      amount: createdServices[0].price,
      status: 'pending',
      nombre: 'Cliente 1',
      email: 'cliente1@it360.com',
      metodoPago: 'transferencia',
    }
  });

  // Contactos de ejemplo
  await prisma.contact.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan@cliente.com',
      message: 'Quiero más información sobre soporte técnico.'
    }
  });
  await prisma.contact.create({
    data: {
      name: 'Ana Gómez',
      email: 'ana@empresa.com',
      message: '¿Ofrecen descuentos para empresas?'
    }
  });

  // Carrito y items de ejemplo
  const cart = await prisma.cart.create({
    data: {
      userId: users[2].id // cliente1
    }
  });
  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: createdProducts[1].id,
      quantity: 2
    }
  });

  // Preferencia de pago de ejemplo
  await prisma.paymentPreference.create({
    data: {
      preferenceId: 'pref-123',
      userId: users[2].id,
      total: 500,
      status: 'pending',
      items: JSON.stringify([{ productId: createdProducts[1].id, quantity: 2 }]),
      payerInfo: JSON.stringify({ name: 'Cliente 1', email: 'cliente1@it360.com' })
    }
  });

  console.log('✅ Todos los datos de prueba insertados en Neon/PostgreSQL');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 