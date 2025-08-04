const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Smartwatches adicionales basados en las imágenes disponibles
const additionalSmartwatches = [
  {
    name: "Imiki by Imilab ST2 1.96\" TFT Función Llamada IP68",
    description: "Smartwatch Imiki ST2 con pantalla TFT de 1.96 pulgadas, función de llamada, resistencia IP68, Bluetooth, monitor cardíaco, múltiples deportes.",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-r.jpg",
    active: true
  },
  {
    name: "Imiki by Imilab ST2 1.96\" TFT Función Llamada IP68 Azul",
    description: "Smartwatch Imiki ST2 en color azul, pantalla TFT de 1.96 pulgadas, función de llamada, resistencia IP68, Bluetooth, monitor cardíaco.",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-a.jpg",
    active: true
  },
  {
    name: "Imiki by Imilab ST1 1.78\" AMOLED Función Llamada IP68",
    description: "Smartwatch Imiki ST1 con pantalla AMOLED de 1.78 pulgadas, función de llamada, resistencia IP68, Bluetooth, monitor cardíaco, diseño elegante.",
    price: 38000,
    basePrice: 35000,
    markup: 8.6,
    stock: 20,
    category: "Accesorio",
    image: "/public/images/imiki-by-imilab-st1-178-amoled-funcion-llamada-ip6.jpg",
    active: true
  },
  {
    name: "Imiki by Imilab TG2 1.43\" AMOLED Función Llamada IP68",
    description: "Smartwatch Imiki TG2 con pantalla AMOLED de 1.43 pulgadas, función de llamada, resistencia IP68, Bluetooth, monitor cardíaco, diseño compacto.",
    price: 32000,
    basePrice: 29000,
    markup: 10.3,
    stock: 25,
    category: "Accesorio",
    image: "/public/images/imiki-by-imilab-tg2-143-amoled-funcion-llamada-ip6.jpg",
    active: true
  },
  {
    name: "Imiki by Imilab TG1 1.43\" AMOLED Función Llamada IP68",
    description: "Smartwatch Imiki TG1 con pantalla AMOLED de 1.43 pulgadas, función de llamada, resistencia IP68, Bluetooth, monitor cardíaco, diseño minimalista.",
    price: 30000,
    basePrice: 27000,
    markup: 11.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/imiki-by-imilab-tg1-143-amoled-funcion-llamada-ip6.jpg",
    active: true
  }
];

async function addMoreSmartwatches() {
  try {
    console.log('⌚ Iniciando agregado de smartwatches adicionales...\n');
    console.log(`📦 Total de smartwatches a agregar: ${additionalSmartwatches.length}\n`);

    let created = 0;
    let skipped = 0;

    for (const smartwatch of additionalSmartwatches) {
      try {
        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findUnique({
          where: { name: smartwatch.name }
        });

        if (existingProduct) {
          console.log(`⏭️  Saltado: ${smartwatch.name} (ya existe)`);
          skipped++;
          continue;
        }

        // Crear el nuevo producto
        await prisma.product.create({
          data: smartwatch
        });

        console.log(`✅ Creado: ${smartwatch.name}`);
        console.log(`   💰 Precio: $${smartwatch.price.toLocaleString()}`);
        console.log(`   📸 Imagen: ${smartwatch.image}`);
        created++;

      } catch (error) {
        console.error(`❌ Error creando ${smartwatch.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Proceso completado!`);
    console.log(`   ✅ Smartwatches creados: ${created}`);
    console.log(`   ⏭️  Smartwatches saltados: ${skipped}`);
    console.log(`   📊 Total procesados: ${additionalSmartwatches.length}`);

  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
addMoreSmartwatches(); 