const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const productos = [
  {
    name: "Imiki by Imilab ST2 1.96\" TFT Función Llamada IP68 Azul",
    description: "Reloj inteligente con pantalla TFT de 1.96\", función de llamada, resistencia IP68, color azul",
    price: 53300,
    stock: 10,
    category: "Electrónicos",
    image: "/images/imiki-st2.jpg",
    active: true
  },
  {
    name: "iPhone 15 Pro Max 256GB",
    description: "Smartphone Apple con chip A17 Pro, cámara triple, 256GB de almacenamiento",
    price: 1500000,
    stock: 5,
    category: "Smartphones",
    image: "/images/iphone-15-pro.jpg",
    active: true
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Smartphone Samsung con S Pen, cámara de 200MP, 512GB de almacenamiento",
    price: 1200000,
    stock: 8,
    category: "Smartphones",
    image: "/images/samsung-s24.jpg",
    active: true
  },
  {
    name: "MacBook Pro 14\" M3 Pro",
    description: "Laptop Apple con chip M3 Pro, 14 pulgadas, 16GB RAM, 512GB SSD",
    price: 2500000,
    stock: 3,
    category: "Computadoras",
    image: "/images/macbook-pro.jpg",
    active: true
  },
  {
    name: "AirPods Pro 2da Generación",
    description: "Auriculares inalámbricos con cancelación de ruido activa y audio espacial",
    price: 250000,
    stock: 15,
    category: "Audio",
    image: "/images/airpods-pro.jpg",
    active: true
  }
];

const usuarios = [
  {
    email: "leonardobergallo@gmail.com",
    name: "Leonardo Bergallo",
    role: "USER",
    password: "password123"
  },
  {
    email: "admin@it360.com",
    name: "Administrador",
    role: "ADMIN",
    password: "admin123"
  },
  {
    email: "cliente@test.com",
    name: "Cliente Test",
    role: "USER",
    password: "cliente123"
  }
];

const tickets = [
  {
    ticketNumber: "TKT-300809-264",
    nombre: "leonardo",
    email: "leonardobergallo@gmail.com",
    telefono: "123456789",
    tipo: "venta",
    categoria: "compra",
    asunto: "Compra de productos",
    descripcion: "• Imiki by Imilab ST2 1.96\" TFT Función Llamada IP68 Azul x1 - $53.300\n\nTotal: $53.300",
    estado: "abierto",
    urgencia: "normal",
    prioridad: "media"
  },
  {
    ticketNumber: "TKT-689207-042",
    nombre: "Cliente Test",
    email: "cliente@test.com",
    telefono: "555555555",
    tipo: "venta",
    categoria: "compra",
    asunto: "Compra múltiple",
    descripcion: "• iPhone 15 Pro Max 256GB x1 - $1.500.000\n• AirPods Pro 2da Generación x1 - $250.000\n\nTotal: $1.750.000",
    estado: "abierto",
    urgencia: "normal",
    prioridad: "media"
  }
];

const servicios = [
  {
    name: "Reparación de Smartphones",
    description: "Servicio técnico especializado en reparación de smartphones",
    price: 50000,
    active: true
  },
  {
    name: "Instalación de Software",
    description: "Instalación y configuración de software en computadoras",
    price: 25000,
    active: true
  },
  {
    name: "Mantenimiento de Redes",
    description: "Configuración y mantenimiento de redes WiFi y cableadas",
    price: 75000,
    active: true
  }
];

async function seedComplete() {
  try {
    console.log('🌱 Iniciando seed completo de la base de datos...');
    
    // Limpiar datos existentes
    console.log('🗑️ Limpiando datos existentes...');
    await prisma.ticket.deleteMany();
    await prisma.service.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    
    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const createdUsers = [];
    for (const usuario of usuarios) {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(usuario.password, 12);
      const user = await prisma.user.create({
        data: {
          ...usuario,
          password: hashedPassword
        }
      });
      createdUsers.push(user);
      console.log(`✅ Usuario creado: ${user.name} (${user.email})`);
    }
    
    // Crear productos
    console.log('📦 Creando productos...');
    for (const producto of productos) {
      await prisma.product.create({
        data: producto
      });
      console.log(`✅ Producto creado: ${producto.name} - $${producto.price}`);
    }
    
    // Crear servicios
    console.log('🔧 Creando servicios...');
    for (const servicio of servicios) {
      await prisma.service.create({
        data: servicio
      });
      console.log(`✅ Servicio creado: ${servicio.name} - $${servicio.price}`);
    }
    
    // Crear tickets
    console.log('🎫 Creando tickets...');
    for (const ticket of tickets) {
      await prisma.ticket.create({
        data: ticket
      });
      console.log(`✅ Ticket creado: ${ticket.ticketNumber} - $${ticket.total}`);
    }
    
    // Verificar datos
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const serviceCount = await prisma.service.count();
    const ticketCount = await prisma.ticket.count();
    
    console.log('\n📊 Resumen de datos creados:');
    console.log(`   👥 Usuarios: ${userCount}`);
    console.log(`   📦 Productos: ${productCount}`);
    console.log(`   🔧 Servicios: ${serviceCount}`);
    console.log(`   🎫 Tickets: ${ticketCount}`);
    
    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('💡 Ahora puedes probar todas las funcionalidades.');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedComplete();
