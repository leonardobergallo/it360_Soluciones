import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugTicket() {
  console.log('🔍 Debug del ticket...\n');

  try {
    // Obtener el primer ticket de compra
    const ticket = await prisma.ticket.findFirst({
      where: {
        tipo: 'compra',
        estado: 'abierto'
      }
    });

    if (!ticket) {
      console.log('❌ No hay tickets de compra');
      return;
    }

    console.log(`📋 Ticket: ${ticket.ticketNumber}`);
    console.log(`👤 Cliente: ${ticket.nombre} (${ticket.email})`);
    console.log(`📝 Descripción completa:`);
    console.log('='.repeat(50));
    console.log(ticket.descripcion);
    console.log('='.repeat(50));

    // Analizar línea por línea
    console.log('\n🔍 Análisis línea por línea:');
    const lineas = ticket.descripcion.split('\n');
    lineas.forEach((linea, index) => {
      console.log(`${index + 1}: "${linea}"`);
    });

    // Probar extracción de productos
    console.log('\n📦 Productos extraídos:');
    const productos = extraerProductos(ticket.descripcion);
    productos.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad}`);
    });

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
          nombre: nombre,
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
            nombre: nombre,
            cantidad: 1
          });
        }
      }
    }
  });
  
  return productos;
}

debugTicket();
