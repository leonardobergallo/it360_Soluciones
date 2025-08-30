/**
 * Script para verificar el conteo exacto de productos en la base de datos
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkProductCount() {
  try {
    console.log("🔍 Verificando productos en la base de datos...\n");

    // 1. Total de productos (activos e inactivos)
    const totalProducts = await prisma.product.count();
    console.log(`📊 Total de productos en BD: ${totalProducts}`);

    // 2. Productos activos
    const activeProducts = await prisma.product.count({
      where: { active: true }
    });
    console.log(`✅ Productos activos: ${activeProducts}`);

    // 3. Productos inactivos
    const inactiveProducts = await prisma.product.count({
      where: { active: false }
    });
    console.log(`❌ Productos inactivos: ${inactiveProducts}`);

    // 4. Productos por categoría
    console.log("\n📂 Productos por categoría:");
    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      where: { active: true },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    });

    productsByCategory.forEach(cat => {
      console.log(`   • ${cat.category || 'Sin categoría'}: ${cat._count.category} productos`);
    });

    // 5. Productos con precio $2,400 (los que importamos)
    const productsWithPrice2400 = await prisma.product.count({
      where: {
        active: true,
        price: 2400
      }
    });
    console.log(`\n💰 Productos con precio $2,400: ${productsWithPrice2400}`);

    // 6. Productos con otros precios
    const productsWithOtherPrices = await prisma.product.count({
      where: {
        active: true,
        price: { not: 2400 }
      }
    });
    console.log(`💰 Productos con otros precios: ${productsWithOtherPrices}`);

    // 7. Verificar si hay productos duplicados por nombre
    console.log("\n🔍 Verificando duplicados por nombre...");
    const allProducts = await prisma.product.findMany({
      where: { active: true },
      select: { name: true }
    });

    const names = allProducts.map(p => p.name);
    const uniqueNames = [...new Set(names)];
    const duplicates = names.length - uniqueNames.length;

    console.log(`   • Nombres únicos: ${uniqueNames.length}`);
    console.log(`   • Productos duplicados: ${duplicates}`);

    if (duplicates > 0) {
      console.log("\n🚨 Productos con nombres duplicados:");
      const nameCounts = {};
      names.forEach(name => {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      });
      
      Object.entries(nameCounts)
        .filter(([name, count]) => count > 1)
        .forEach(([name, count]) => {
          console.log(`   • "${name}": ${count} veces`);
        });
    }

    // 8. Resumen
    console.log("\n📋 RESUMEN:");
    console.log(`   • Total en BD: ${totalProducts}`);
    console.log(`   • Activos: ${activeProducts}`);
    console.log(`   • Inactivos: ${inactiveProducts}`);
    console.log(`   • Con precio $2,400: ${productsWithPrice2400}`);
    console.log(`   • Con otros precios: ${productsWithOtherPrices}`);
    console.log(`   • Nombres únicos: ${uniqueNames.length}`);
    console.log(`   • Duplicados: ${duplicates}`);

    // 9. Explicación de la diferencia
    console.log("\n💡 EXPLICACIÓN:");
    if (activeProducts !== 111) {
      console.log(`   • La página muestra 111 productos pero hay ${activeProducts} activos`);
      console.log(`   • Posibles causas:`);
      console.log(`     - Filtros en el frontend (precio, categoría, búsqueda)`);
      console.log(`     - Productos duplicados que se cuentan como uno`);
      console.log(`     - Caché del navegador`);
      console.log(`     - Diferencia entre desarrollo y producción`);
    } else {
      console.log(`   • Los números coinciden: ${activeProducts} productos activos`);
    }

  } catch (error) {
    console.error("❌ Error verificando productos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductCount();
