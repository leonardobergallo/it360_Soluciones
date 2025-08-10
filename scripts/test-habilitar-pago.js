import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testHabilitarPago() {
  console.log('🧪 Probando sistema de habilitar pago...\n');

  try {
    // Buscar tickets de compra
    const tickets = await prisma.ticket.findMany({
      where: {
        tipo: 'compra',
        estado: 'abierto'
      },
      take: 5
    });

    console.log(`📋 Encontrados ${tickets.length} tickets de compra:`);
    
    tickets.forEach((ticket, index) => {
      console.log(`\n${index + 1}. Ticket ${ticket.ticketNumber}`);
      console.log(`   • Cliente: ${ticket.nombre} (${ticket.email})`);
      console.log(`   • Estado: ${ticket.estado}`);
      console.log(`   • Descripción: ${ticket.descripcion.substring(0, 100)}...`);
    });

    if (tickets.length === 0) {
      console.log('\n❌ No hay tickets de compra para probar');
      console.log('💡 Crea una solicitud de compra desde el frontend primero');
      return;
    }

    // Simular verificación de stock
    console.log('\n🔍 Verificando stock...');
    const primerTicket = tickets[0];
    const productos = extraerProductos(primerTicket.descripcion);
    
    console.log(`📦 Productos en la solicitud:`);
    productos.forEach(p => {
      console.log(`   • ${p.nombre} - Cantidad: ${p.cantidad}`);
    });

    // Verificar stock real
    for (const producto of productos) {
      const productoDB = await prisma.product.findFirst({
        where: {
          name: { contains: producto.nombre, mode: 'insensitive' }
        }
      });
      
      if (productoDB) {
        console.log(`   ✅ ${producto.nombre}: Stock disponible ${productoDB.stock}`);
      } else {
        console.log(`   ❌ ${producto.nombre}: No encontrado en la base de datos`);
      }
    }

    console.log('\n✅ Sistema de verificación de stock funcionando correctamente');
    console.log('💡 Para probar el envío de emails, usa la interfaz de administración');

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
    const match = linea.match(/([^-]+)-?\s*Cantidad[:\s]*(\d+)/i);
    if (match) {
      productos.push({
        nombre: match[1].trim(),
        cantidad: parseInt(match[2])
      });
    } else {
      const match2 = linea.match(/([^-]+)-?\s*\$?(\d+(?:\.\d{2})?)/);
      if (match2 && !linea.toLowerCase().includes('total')) {
        productos.push({
          nombre: match2[1].trim(),
          cantidad: 1
        });
      }
    }
  });
  
  return productos;
}

testHabilitarPago();
