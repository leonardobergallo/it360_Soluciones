/**
 * Verifica productos específicos mencionados por el usuario
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkSpecificProducts() {
  try {
    console.log("🔍 Verificando productos específicos...\n");

    // Productos mencionados por el usuario
    const productsToCheck = [
      "Foxbox Engage Soporte Imantado para Celular",
      "MOTOROLA Moto G84"
    ];

    for (const productName of productsToCheck) {
      const product = await prisma.product.findFirst({
        where: {
          name: {
            contains: productName,
            mode: 'insensitive'
          }
        }
      });

      if (product) {
        console.log(`✅ ${product.name}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString("es-AR")}`);
        console.log(`   📂 Categoría: ${product.category}`);
        console.log(`   📦 Stock: ${product.stock}`);
        console.log(`   ✅ Activo: ${product.active}`);
        console.log("");
      } else {
        console.log(`❌ No encontrado: ${productName}`);
        console.log("");
      }
    }

    // Verificar si hay productos con $2,400
    const productsWith2400 = await prisma.product.findMany({
      where: {
        price: 2400
      },
      select: {
        name: true,
        price: true,
        category: true
      }
    });

    if (productsWith2400.length > 0) {
      console.log("⚠️ PRODUCTOS CON $2,400 ENCONTRADOS:");
      productsWith2400.forEach(p => {
        console.log(`   • ${p.name} - ${p.category} - $${p.price.toLocaleString("es-AR")}`);
      });
    } else {
      console.log("✅ NO hay productos con $2,400 en la base de datos");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSpecificProducts();
