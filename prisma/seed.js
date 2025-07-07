const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Usuarios
  await prisma.user.createMany({
    data: [
      { email: 'admin@it360.com', password: 'admin123', name: 'Administrador', role: 'ADMIN' },
      { email: 'tecnico@it360.com', password: 'tecnico123', name: 'Sofía López', role: 'TECNICO' },
      { email: 'cliente1@it360.com', password: 'cliente123', name: 'Carlos Pérez', role: 'USER' },
      { email: 'cliente2@it360.com', password: 'cliente123', name: 'María García', role: 'USER' },
    ],
    skipDuplicates: true,
  });

  // Servicios
  await prisma.service.createMany({
    data: [
      { name: 'Desarrollo Web Corporativo', description: 'Sitios web empresariales a medida', price: 2500 },
      { name: 'Soporte Técnico Integral', description: 'Asistencia remota y presencial para empresas', price: 800 },
      { name: 'Consultoría en Ciberseguridad', description: 'Auditoría y protección de sistemas', price: 3200 },
    ],
    skipDuplicates: true,
  });

  // Productos
  await prisma.product.createMany({
    data: [
      { name: 'Notebook Dell XPS 13', description: 'Ultrabook profesional', price: 1800, stock: 5 },
      { name: 'Teclado Mecánico Logitech', description: 'Teclado retroiluminado para oficina', price: 120, stock: 30 },
      { name: 'Monitor Samsung 27"', description: 'Monitor LED Full HD', price: 350, stock: 12 },
    ],
    skipDuplicates: true,
  });

  // Ventas
  const user1 = await prisma.user.findFirst({ where: { email: 'cliente1@it360.com' } });
  const user2 = await prisma.user.findFirst({ where: { email: 'cliente2@it360.com' } });
  const product = await prisma.product.findFirst();
  const service = await prisma.service.findFirst();
  if (user1 && product && service) {
    await prisma.sale.create({
      data: { userId: user1.id, productId: product.id, amount: product.price }
    });
    await prisma.sale.create({
      data: { userId: user1.id, serviceId: service.id, amount: service.price }
    });
  }
  if (user2 && product && service) {
    await prisma.sale.create({
      data: { userId: user2.id, productId: product.id, amount: product.price }
    });
    await prisma.sale.create({
      data: { userId: user2.id, serviceId: service.id, amount: service.price }
    });
  }

  // Contactos
  await prisma.contact.createMany({
    data: [
      { name: 'Lucía Fernández', email: 'lucia@mail.com', message: '¿Pueden cotizarme un desarrollo web?' },
      { name: 'Pedro Gómez', email: 'pedro@mail.com', message: 'Estoy interesado en soporte técnico para mi empresa.' },
      { name: 'Valeria Torres', email: 'valeria@mail.com', message: '¿Qué opciones de ciberseguridad ofrecen?' },
    ],
  });
}

main()
  .then(() => {
    console.log('Seed ejecutado con éxito');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  }); 