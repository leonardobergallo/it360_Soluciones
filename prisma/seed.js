const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Limpiar tablas en orden de dependencias
  await prisma.sale.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.paymentPreference.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();

  // Usuarios
  const users = [
    { email: 'admin@it360.com', password: 'admin123', name: 'Administrador', role: 'ADMIN' },
    { email: 'tecnico@it360.com', password: 'tecnico123', name: 'Sofía López', role: 'TECNICO' },
    { email: 'cliente1@it360.com', password: 'cliente123', name: 'Carlos Pérez', role: 'USER' },
    { email: 'cliente2@it360.com', password: 'cliente123', name: 'María García', role: 'USER' },
  ];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: { ...user, password: hashedPassword }
    });
  }

  // Servicios
  const services = [
    { name: 'Desarrollo Web Corporativo', description: 'Sitios web empresariales a medida', price: 2500 },
    { name: 'Soporte Técnico Integral', description: 'Asistencia remota y presencial para empresas', price: 800 },
    { name: 'Consultoría en Ciberseguridad', description: 'Auditoría y protección de sistemas', price: 3200 },
  ];
  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },
      update: {},
      create: service
    });
  }

  // Productos
  const products = [
    {
      name: 'Laptop HP Pavilion',
      description: 'Laptop de alto rendimiento para trabajo y gaming',
      price: 899.99,
      category: 'Laptops',
      stock: 10,
      image: '/servicio-pc.png'
    },
    {
      name: 'Mouse Gaming RGB',
      description: 'Mouse inalámbrico con iluminación RGB personalizable',
      price: 49.99,
      category: 'Periféricos',
      stock: 25,
      image: '/servicio-productos.png'
    },
    {
      name: 'Teclado Mecánico',
      description: 'Teclado mecánico con switches Cherry MX Blue',
      price: 129.99,
      category: 'Periféricos',
      stock: 15,
      image: '/servicio-productos.png'
    },
    {
      name: 'Monitor 24" Full HD',
      description: 'Monitor LED de 24 pulgadas con resolución Full HD',
      price: 199.99,
      category: 'Monitores',
      stock: 8,
      image: '/servicio-pc.png'
    },
    {
      name: 'Disco SSD 500GB',
      description: 'Disco sólido interno de 500GB para mejorar el rendimiento',
      price: 79.99,
      category: 'Almacenamiento',
      stock: 20,
      image: '/servicio-productos.png'
    }
  ];
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product
    });
  }

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
  const contacts = [
    { name: 'Lucía Fernández', email: 'lucia@mail.com', message: '¿Pueden cotizarme un desarrollo web?' },
    { name: 'Pedro Gómez', email: 'pedro@mail.com', message: 'Estoy interesado en soporte técnico para mi empresa.' },
    { name: 'Valeria Torres', email: 'valeria@mail.com', message: '¿Qué opciones de ciberseguridad ofrecen?' },
  ];
  for (const contact of contacts) {
    await prisma.contact.upsert({
      where: { email: contact.email },
      update: {},
      create: contact
    });
  }

  console.log('✅ Seed ejecutado con éxito');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  }); 