/**
 * Script para crear órdenes de prueba
 * Uso: node scripts/create-sample-orders.js
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Datos de prueba
const SAMPLE_ORDERS = [
  {
    userId: "test-user-id",
    total: 64990,
    status: "COMPLETED",
    shippingMethod: "pickup",
    paymentMethod: "cash",
    notes: "Cliente solicitó factura A",
    items: [
      {
        productName: "Parlante Portátil Philco 940UPS Bluetooth Full Led",
        quantity: 1,
        price: 64990
      }
    ]
  },
  {
    userId: "test-user-id",
    total: 125000,
    status: "PROCESSING",
    shippingMethod: "delivery",
    paymentMethod: "transfer",
    shippingAddress: "Av. San Martín 1234, Rosario, Santa Fe",
    notes: "Envío urgente",
    items: [
      {
        productName: "Monitor LG 24ML600",
        quantity: 1,
        price: 125000
      }
    ]
  },
  {
    userId: "test-user-id",
    total: 85000,
    status: "PENDING",
    shippingMethod: "pickup",
    paymentMethod: "cash",
    items: [
      {
        productName: "Teclado Mecánico Logitech G Pro X",
        quantity: 1,
        price: 85000
      }
    ]
  },
  {
    userId: "test-user-id",
    total: 180000,
    status: "RETURNED",
    shippingMethod: "pickup",
    paymentMethod: "cash",
    notes: "Producto defectuoso - devolución aprobada",
    items: [
      {
        productName: "Impresora HP LaserJet Pro M404n",
        quantity: 1,
        price: 180000
      }
    ]
  },
  {
    userId: "test-user-id",
    total: 320000,
    status: "COMPLETED",
    shippingMethod: "delivery",
    paymentMethod: "credit_card",
    shippingAddress: "Belgrano 567, Santa Fe Capital",
    items: [
      {
        productName: "iPhone 15 128GB",
        quantity: 1,
        price: 320000
      }
    ]
  }
];

async function createSampleOrders() {
  try {
    console.log("🛒 Creando órdenes de prueba...");

    for (const orderData of SAMPLE_ORDERS) {
      // Buscar el producto por nombre
      const product = await prisma.product.findFirst({
        where: {
          name: {
            contains: orderData.items[0].productName.split(' ')[0], // Buscar por primera palabra
            mode: 'insensitive'
          }
        }
      });

      if (!product) {
        console.log(`⚠️ Producto no encontrado: ${orderData.items[0].productName}`);
        continue;
      }

      // Generar número de orden único
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(Date.now() + Math.random()).slice(-6)}`;

      // Crear la orden
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: orderData.userId,
          total: orderData.total,
          status: orderData.status,
          shippingAddress: orderData.shippingAddress,
          shippingMethod: orderData.shippingMethod,
          paymentMethod: orderData.paymentMethod,
          notes: orderData.notes,
          items: {
            create: orderData.items.map(item => ({
              productId: product.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      console.log(`✅ Orden creada: ${order.orderNumber} - ${product.name} - $${order.total.toLocaleString('es-AR')}`);
    }

    console.log("🎉 Órdenes de prueba creadas exitosamente");

  } catch (error) {
    console.error("❌ Error al crear órdenes:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createSampleOrders();
