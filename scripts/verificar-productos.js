import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function verificarProductos() {
  console.log('🔍 Verificando productos en la base de datos...\n');

  try {
    // Obtener todos los productos
    const productos = await prisma.product.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        category: true
      }
    });

    console.log(`📦 Encontrados ${productos.length} productos:`);
    productos.forEach((producto, index) => {
      console.log(`${index + 1}. ${producto.name}`);
      console.log(`   • Stock: ${producto.stock}`);
      console.log(`   • Precio: $${producto.price}`);
      console.log(`   • Categoría: ${producto.category}`);
      console.log('');
    });

    // Buscar productos específicos mencionados en los tickets
    const productosABuscar = [
      'Disco SSD',
      'Enchufe Inteligente',
      'Foxbox Arrancador',
      'Apple EarPods'
    ];

    console.log('🔍 Buscando productos específicos...');
    for (const nombreBuscar of productosABuscar) {
      const productosEncontrados = await prisma.product.findMany({
        where: {
          name: {
            contains: nombreBuscar,
            mode: 'insensitive'
          }
        },
        select: {
          name: true,
          stock: true
        }
      });

      if (productosEncontrados.length > 0) {
        console.log(`✅ "${nombreBuscar}":`);
        productosEncontrados.forEach(p => {
          console.log(`   • ${p.name} - Stock: ${p.stock}`);
        });
      } else {
        console.log(`❌ "${nombreBuscar}": No encontrado`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarProductos();
