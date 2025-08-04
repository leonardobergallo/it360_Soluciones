const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Auriculares adicionales basados en las imágenes disponibles
const additionalHeadphones = [
  {
    name: "Klip Xtreme Auriculares Edgebuds Pro Carga Inalámbrica",
    description: "Auriculares inalámbricos Klip Xtreme Edgebuds Pro con carga inalámbrica, cancelación de ruido, Bluetooth 5.0, batería de 24 horas.",
    price: 38000,
    basePrice: 35000,
    markup: 8.6,
    stock: 20,
    category: "Accesorio",
    image: "/public/images/klip-xtreme-auriculares-edgebuds-pro-carga-inalamb-3.png",
    active: true
  },
  {
    name: "Klip Xtreme Auricular Zoundbuds IPX4 Azul",
    description: "Auriculares Klip Xtreme Zoundbuds en color azul, resistencia IPX4 al agua, sonido estéreo, micrófono integrado, batería de 18 horas.",
    price: 25000,
    basePrice: 23000,
    markup: 8.7,
    stock: 25,
    category: "Accesorio",
    image: "/public/images/klip-xtreme-auricular-zoundbuds-ipx4-azul.jpg",
    active: true
  },
  {
    name: "Klip Xtreme Auricular Touchbuds IPX3 Verde Agua",
    description: "Auriculares Klip Xtreme Touchbuds en color verde agua, resistencia IPX3, control táctil, sonido envolvente, batería de 20 horas.",
    price: 28000,
    basePrice: 25500,
    markup: 9.8,
    stock: 22,
    category: "Accesorio",
    image: "/public/images/klip-xtreme-auricular-touchbuds-ipx3-verde-agua.jpg",
    active: true
  },
  {
    name: "Lenovo Auricular Gaming XG02 Cancelación de Ruido",
    description: "Auriculares gaming Lenovo XG02 con cancelación de ruido activa, micrófono desmontable, sonido 7.1 virtual, ideal para gaming y streaming.",
    price: 42000,
    basePrice: 38000,
    markup: 10.5,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg",
    active: true
  },
  {
    name: "Auricular Bluetooth Pop It ST91 Varios Colores",
    description: "Auriculares Bluetooth Pop It ST91 disponibles en varios colores, diseño compacto, sonido estéreo, batería de 12 horas, micrófono integrado.",
    price: 18000,
    basePrice: 16500,
    markup: 9.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/auricular-bluetooth-pop-it-st91-varios-colores.png",
    active: true
  },
  {
    name: "Monster Auricular XKT03 Cancelación de Ruido Baja",
    description: "Auriculares Monster XKT03 con cancelación de ruido pasiva, sonido de alta fidelidad, diseño ergonómico, batería de 16 horas.",
    price: 22000,
    basePrice: 20000,
    markup: 10,
    stock: 18,
    category: "Accesorio",
    image: "/public/images/monster-auricular-xkt03-cancelacion-de-ruido-baja.png",
    active: true
  },
  {
    name: "Lenovo Auricular LP40 Pro Cancelación de Ruido IPX4",
    description: "Auriculares Lenovo LP40 Pro con cancelación de ruido activa, resistencia IPX4, sonido Hi-Fi, batería de 22 horas, carga rápida.",
    price: 35000,
    basePrice: 32000,
    markup: 9.4,
    stock: 20,
    category: "Accesorio",
    image: "/public/images/lenovo-auricular-lp40-pro-cancelacion-de-ruido-ipx-3.png",
    active: true
  },
  {
    name: "Foxbox Auriculares Boost Link Pro Micrófono Control",
    description: "Auriculares Foxbox Boost Link Pro con micrófono con control, sonido estéreo, batería de 14 horas, diseño deportivo, resistencia al sudor.",
    price: 20000,
    basePrice: 18500,
    markup: 8.1,
    stock: 25,
    category: "Accesorio",
    image: "/public/images/foxbox-auriculares-boost-link-pro-microfono-contro.jpg",
    active: true
  },
  {
    name: "Alo Auriculares Sharp 3.5mm Micrófono Colores Varios",
    description: "Auriculares Alo Sharp con conector 3.5mm, micrófono integrado, disponibles en varios colores, sonido cristalino, compatibilidad universal.",
    price: 8000,
    basePrice: 7200,
    markup: 11.1,
    stock: 40,
    category: "Accesorio",
    image: "/public/images/alo-auriculares-sharp-3-5mm-microfono-colores-vari.jpg",
    active: true
  },
  {
    name: "Foxbox Auriculares Boost Pop Micrófono 3.5mm Negro",
    description: "Auriculares Foxbox Boost Pop con micrófono 3.5mm en color negro, sonido estéreo, control de volumen, diseño cómodo, compatibilidad universal.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 35,
    category: "Accesorio",
    image: "/public/images/foxbox-auriculares-boost-pop-microfono-3-5mm-negro.jpg",
    active: true
  },
  {
    name: "Klip Xtreme Xtremebuds Auriculares Deportivos BT",
    description: "Auriculares deportivos Klip Xtreme Xtremebuds Bluetooth, diseño ergonómico, resistencia al sudor, sonido estéreo, batería de 10 horas.",
    price: 15000,
    basePrice: 13500,
    markup: 11.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/klip-xtreme-xtremebuds-auriculares-deportivos-bt-n.jpg",
    active: true
  },
  {
    name: "Apple EarPods 3.5mm A1472",
    description: "Auriculares Apple EarPods con conector 3.5mm modelo A1472, sonido optimizado, micrófono integrado, diseño ergonómico, compatibilidad universal.",
    price: 18000,
    basePrice: 16500,
    markup: 9.1,
    stock: 25,
    category: "Accesorio",
    image: "/public/images/apple-earpods-3-5-mm-a1472.jpg",
    active: true
  },
  {
    name: "P47 Auricular Inalámbrico Bluetooth Rojo",
    description: "Auriculares inalámbricos P47 en color rojo, Bluetooth 5.0, sonido estéreo, batería de 8 horas, micrófono integrado, diseño compacto.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/p47-auricular-inalambrico-bluetooth-rojo.jpg",
    active: true
  },
  {
    name: "P47 Auricular Inalámbrico Bluetooth Verde",
    description: "Auriculares inalámbricos P47 en color verde, Bluetooth 5.0, sonido estéreo, batería de 8 horas, micrófono integrado, diseño compacto.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/p47-auricular-inalambrico-bluetooth-verde.jpg",
    active: true
  },
  {
    name: "P47 Auricular Inalámbrico Bluetooth Azul",
    description: "Auriculares inalámbricos P47 en color azul, Bluetooth 5.0, sonido estéreo, batería de 8 horas, micrófono integrado, diseño compacto.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/p47-auricular-inalambrico-bluetooth-azul.jpg",
    active: true
  },
  {
    name: "P47 Auricular Inalámbrico Bluetooth Blanco",
    description: "Auriculares inalámbricos P47 en color blanco, Bluetooth 5.0, sonido estéreo, batería de 8 horas, micrófono integrado, diseño compacto.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/p47-auricular-inalambrico-bluetooth-blanco-3.jpg",
    active: true
  },
  {
    name: "Klip Xtreme Auriculares Style Azul",
    description: "Auriculares Klip Xtreme Style en color azul, diseño elegante, sonido estéreo, micrófono integrado, batería de 15 horas, carga rápida.",
    price: 32000,
    basePrice: 29000,
    markup: 10.3,
    stock: 20,
    category: "Accesorio",
    image: "/public/images/klip-xtreme-auriculares-style-azul.png",
    active: true
  }
];

async function addMoreHeadphones() {
  try {
    console.log('🎧 Iniciando agregado de auriculares adicionales...\n');
    console.log(`📦 Total de auriculares a agregar: ${additionalHeadphones.length}\n`);

    let created = 0;
    let skipped = 0;

    for (const headphone of additionalHeadphones) {
      try {
        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findUnique({
          where: { name: headphone.name }
        });

        if (existingProduct) {
          console.log(`⏭️  Saltado: ${headphone.name} (ya existe)`);
          skipped++;
          continue;
        }

        // Crear el nuevo producto
        await prisma.product.create({
          data: headphone
        });

        console.log(`✅ Creado: ${headphone.name}`);
        console.log(`   💰 Precio: $${headphone.price.toLocaleString()}`);
        console.log(`   📸 Imagen: ${headphone.image}`);
        created++;

      } catch (error) {
        console.error(`❌ Error creando ${headphone.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Proceso completado!`);
    console.log(`   ✅ Auriculares creados: ${created}`);
    console.log(`   ⏭️  Auriculares saltados: ${skipped}`);
    console.log(`   📊 Total procesados: ${additionalHeadphones.length}`);

  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
addMoreHeadphones(); 