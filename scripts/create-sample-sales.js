/**
 * Script para crear ventas de prueba usando la tabla Sale existente
 * Uso: node scripts/create-sample-sales.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Datos de prueba
const SAMPLE_SALES = [
  {
    userId: "test-user-id",
    amount: 64990,
    status: "completed",
    metodoPago: "cash",
    productName: "Parlante Portátil"
  },
  {
    userId: "test-user-id",
    amount: 125000,
    status: "processing",
    metodoPago: "transfer",
    productName: "Monitor"
  },
  {
    userId: "test-user-id",
    amount: 85000,
    status: "pending",
    metodoPago: "cash",
    productName: "Teclado"
  },
  {
    userId: "test-user-id",
    amount: 180000,
    status: "returned",
    metodoPago: "cash",
    productName: "Impresora"
  },
  {
    userId: "test-user-id",
    amount: 320000,
    status: "completed",
    metodoPago: "credit_card",
    productName: "iPhone"
  }
];

async function createSampleSales() {
  try {
    console.log("🛒 Creando ventas de prueba...");

    for (const saleData of SAMPLE_SALES) {
      // Buscar el producto por nombre
      const product = await prisma.product.findFirst({
        where: {
          name: {
            contains: saleData.productName.split(' ')[0], // Buscar por primera palabra
            mode: 'insensitive'
          }
        }
      });

      if (!product) {
        console.log(`⚠️ Producto no encontrado: ${saleData.productName}`);
        continue;
      }

      // Crear la venta
      const sale = await prisma.sale.create({
        data: {
          userId: saleData.userId,
          productId: product.id,
          amount: saleData.amount,
          status: saleData.status,
          metodoPago: saleData.metodoPago,
          nombre: "Usuario de Prueba",
          email: "test@example.com",
          telefono: "1234567890",
          direccion: "Dirección de prueba"
        },
        include: {
          product: true
        }
      });

      console.log(`✅ Venta creada: ${sale.id} - ${product.name} - $${sale.amount.toLocaleString('es-AR')}`);
    }

    console.log("🎉 Ventas de prueba creadas exitosamente");

  } catch (error) {
    console.error("❌ Error al crear ventas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createSampleSales();
