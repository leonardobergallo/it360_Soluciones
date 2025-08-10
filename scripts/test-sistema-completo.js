import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testSistemaCompleto() {
  console.log('🧪 Probando sistema completo de solicitudes de compra...\n');

  try {
    // 1. Verificar tickets de compra
    console.log('📋 1. Verificando tickets de compra...');
    const tickets = await prisma.ticket.findMany({
      where: {
        tipo: 'compra',
        estado: 'abierto'
      },
      take: 3
    });

    console.log(`   Encontrados ${tickets.length} tickets de compra pendientes`);

    if (tickets.length === 0) {
      console.log('   ❌ No hay tickets para probar');
      console.log('   💡 Crea una solicitud de compra desde el frontend primero');
      return;
    }

    // 2. Verificar stock de productos
    console.log('\n📦 2. Verificando stock de productos...');
    const primerTicket = tickets[0];
    const productos = extraerProductos(primerTicket.descripcion);
    
    console.log(`   Productos en ticket ${primerTicket.ticketNumber}:`);
    productos.forEach(p => {
      console.log(`   • ${p.nombre} - Cantidad: ${p.cantidad}`);
    });

    // Verificar stock real
    let stockDisponible = true;
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre, mode: 'insensitive' }
        }
      });
      
      if (productoDB) {
        console.log(`   ✅ ${producto.nombre}: Stock ${productoDB.stock} - Solicitado ${producto.cantidad}`);
        if (productoDB.stock < producto.cantidad) {
          stockDisponible = false;
        }
      } else {
        console.log(`   ❌ ${producto.nombre}: No encontrado`);
        stockDisponible = false;
      }
    }

    // 3. Verificar carrito del usuario
    console.log('\n🛒 3. Verificando carrito del usuario...');
    const user = await prisma.user.findUnique({
      where: { email: primerTicket.email }
    });

    if (user) {
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: { include: { product: true } } }
      });

      if (cart && cart.items.length > 0) {
        console.log(`   ✅ Carrito encontrado con ${cart.items.length} productos`);
        cart.items.forEach(item => {
          console.log(`   • ${item.product.name} - Cantidad: ${item.quantity}`);
        });
      } else {
        console.log('   ℹ️ Carrito vacío o no encontrado');
      }
    } else {
      console.log('   ❌ Usuario no encontrado');
    }

    // 4. Resumen del sistema
    console.log('\n📊 4. Resumen del sistema:');
    console.log(`   • Tickets de compra: ${tickets.length}`);
    console.log(`   • Stock disponible: ${stockDisponible ? '✅ Sí' : '❌ No'}`);
    console.log(`   • Usuario encontrado: ${user ? '✅ Sí' : '❌ No'}`);
    console.log(`   • Email configurado: ${process.env.IT360_EMAIL || '❌ No configurado'}`);

    if (stockDisponible && user) {
      console.log('\n✅ Sistema listo para probar');
      console.log('💡 Ve a la interfaz de administración y aprueba una solicitud');
      console.log('🔗 URL: http://localhost:3000/admin/solicitudes-compra');
    } else {
      console.log('\n❌ Sistema no está listo para probar');
      if (!stockDisponible) {
        console.log('   • Falta stock en algunos productos');
      }
      if (!user) {
        console.log('   • Usuario no encontrado en la base de datos');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Función para extraer productos de la descripción
function extraerProductos(descripcion) {
  const productos = [];
  
  const lineas = descripcion.split('\n');
  lineas.forEach(linea => {
    // Buscar productos con formato "Producto x1 - $precio"
    const match = linea.match(/([^-]+)\s*x(\d+)\s*-\s*\$?([\d,]+)/i);
    if (match) {
      const nombre = match[1].trim();
      const cantidad = parseInt(match[2]);
      
      // Filtrar líneas que no son productos (teléfono, dirección, etc.)
      if (!nombre.toLowerCase().includes('teléfono') && 
          !nombre.toLowerCase().includes('dirección') &&
          !nombre.toLowerCase().includes('email') &&
          !nombre.toLowerCase().includes('nombre') &&
          !nombre.toLowerCase().includes('total')) {
        productos.push({
          nombre: nombre.replace(/^[•\s]+/, ''), // Remover símbolos al inicio
          cantidad: cantidad
        });
      }
    } else {
      // Buscar productos con formato "Producto - $precio"
      const match2 = linea.match(/([^-]+)\s*-\s*\$?([\d,]+)/i);
      if (match2 && !linea.toLowerCase().includes('total')) {
        const nombre = match2[1].trim();
        
        // Filtrar líneas que no son productos
        if (!nombre.toLowerCase().includes('teléfono') && 
            !nombre.toLowerCase().includes('dirección') &&
            !nombre.toLowerCase().includes('email') &&
            !nombre.toLowerCase().includes('nombre')) {
          productos.push({
            nombre: nombre.replace(/^[•\s]+/, ''), // Remover símbolos al inicio
            cantidad: 1
          });
        }
      }
    }
  });
  
  return productos;
}

testSistemaCompleto();
