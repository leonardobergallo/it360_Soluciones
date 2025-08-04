const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Nuevos productos basados en las imágenes disponibles
const newProducts = [
  // Celulares y Tablets
  {
    name: "Xiaomi Redmi A5 4GB 128GB Sandy Gold",
    description: "Smartphone Xiaomi Redmi A5 con 4GB RAM, 128GB almacenamiento, cámara de 50MP, batería de 5000mAh. Incluye carga rápida de regalo.",
    price: 180000,
    basePrice: 165000,
    markup: 9.1,
    stock: 15,
    category: "Celulares",
    image: "/public/images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg",
    active: true
  },
  {
    name: "Xiaomi Redmi A5 4GB 128GB Ocean Blue",
    description: "Smartphone Xiaomi Redmi A5 en color azul océano, 4GB RAM, 128GB almacenamiento, cámara de 50MP, batería de 5000mAh.",
    price: 185000,
    basePrice: 170000,
    markup: 8.8,
    stock: 12,
    category: "Celulares",
    image: "/public/images/xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg",
    active: true
  },
  {
    name: "Xiaomi Redmi Pad SE 8.7\" 6GB 128GB Grey",
    description: "Tablet Xiaomi Redmi Pad SE de 8.7 pulgadas, 6GB RAM, 128GB almacenamiento, pantalla LCD, batería de 8000mAh.",
    price: 220000,
    basePrice: 200000,
    markup: 10,
    stock: 8,
    category: "Tablets",
    image: "/public/images/xiaomi-redmi-pad-se-8-7-6-128-grey.jpg",
    active: true
  },
  {
    name: "Xiaomi Redmi Pad SE 8.7\" 6GB 128GB SIM Grey",
    description: "Tablet Xiaomi Redmi Pad SE con conectividad SIM, 8.7 pulgadas, 6GB RAM, 128GB almacenamiento, ideal para trabajo móvil.",
    price: 240000,
    basePrice: 220000,
    markup: 9.1,
    stock: 6,
    category: "Tablets",
    image: "/public/images/xiaomi-redmi-pad-se-8-7-6-128-sim-card-grey.jpg",
    active: true
  },

  // Smartwatches y Relojes
  {
    name: "Apple Watch SE 2nd Gen GPS 44mm",
    description: "Apple Watch SE de segunda generación, GPS, 44mm, caja de aluminio, correa deportiva, monitor cardíaco, resistente al agua.",
    price: 350000,
    basePrice: 320000,
    markup: 9.4,
    stock: 10,
    category: "Accesorio",
    image: "/public/images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg",
    active: true
  },
  {
    name: "Apple Watch Series 9 GPS 41mm",
    description: "Apple Watch Series 9, GPS, 41mm, caja de aluminio, correa deportiva, chip S9, doble tap, monitor cardíaco avanzado.",
    price: 420000,
    basePrice: 380000,
    markup: 10.5,
    stock: 8,
    category: "Accesorio",
    image: "/public/images/apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg",
    active: true
  },
  {
    name: "Scykei Civis Smartwatch AMOLED 2.1\" Curvo",
    description: "Smartwatch Scykei Civis con pantalla AMOLED curva de 2.1 pulgadas, 60Hz, función de llamada, Bluetooth, resistente al agua.",
    price: 85000,
    basePrice: 78000,
    markup: 9,
    stock: 20,
    category: "Accesorio",
    image: "/public/images/scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg",
    active: true
  },
  {
    name: "Scykei Movis Smartwatch AMOLED 2.1\" Curvo",
    description: "Smartwatch Scykei Movis con pantalla AMOLED curva de 2.1 pulgadas, música, GPS, 60Hz, función de llamada, resistente al agua.",
    price: 95000,
    basePrice: 87000,
    markup: 9.2,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg",
    active: true
  },
  {
    name: "Scykei Malla de Silicona y Cuero 22mm",
    description: "Correa de reloj Scykei de silicona y cuero de 22mm, compatible con múltiples modelos de smartwatch, ajustable, resistente.",
    price: 15000,
    basePrice: 13500,
    markup: 11.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/scykei-malla-de-silicona-y-cuero-22mm-apta-modelo.jpg",
    active: true
  },

  // Auriculares
  {
    name: "Lenovo Auricular BT LP3 Pro Black",
    description: "Auriculares inalámbricos Lenovo LP3 Pro, cancelación de ruido, Bluetooth 5.0, batería de 20 horas, micrófono integrado.",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 25,
    category: "Accesorio",
    image: "/public/images/lenovo-auricular-bt-lp3-pro-black.jpg",
    active: true
  },
  {
    name: "Lenovo Auricular BT X3 Pro Conducción Ósea",
    description: "Auriculares Lenovo X3 Pro con tecnología de conducción ósea, IP56, resistente al agua y polvo, ideal para deportes.",
    price: 35000,
    basePrice: 32000,
    markup: 9.4,
    stock: 18,
    category: "Accesorio",
    image: "/public/images/lenovo-auricular-bt-x3-pro-conduccion-osea-ip56-ne.jpg",
    active: true
  },
  {
    name: "Lenovo Auricular BT Supraaural TA330 Black",
    description: "Auriculares supraaurales Lenovo TA330, Bluetooth 5.0, sonido envolvente, batería de 15 horas, diseño cómodo.",
    price: 28000,
    basePrice: 25500,
    markup: 9.8,
    stock: 22,
    category: "Accesorio",
    image: "/public/images/lenovo-auricular-bt-supraaural-ta330-black.jpg",
    active: true
  },
  {
    name: "JBL Wave Flex White",
    description: "Auriculares inalámbricos JBL Wave Flex en color blanco, sonido JBL Signature, 32 horas de batería, resistente al agua IPX4.",
    price: 55000,
    basePrice: 50000,
    markup: 10,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/jbl-wave-flex-white.png",
    active: true
  },
  {
    name: "JBL Wave Flex Black",
    description: "Auriculares inalámbricos JBL Wave Flex en color negro, sonido JBL Signature, 32 horas de batería, resistente al agua IPX4.",
    price: 55000,
    basePrice: 50000,
    markup: 10,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/jbl-wave-flex-black.png",
    active: true
  },

  // Gaming
  {
    name: "Sony PS5 PlayStation 5 Slim 1TB Digital",
    description: "PlayStation 5 Slim edición digital, 1TB de almacenamiento, incluye juego Returnal, control DualSense, consola más compacta.",
    price: 850000,
    basePrice: 780000,
    markup: 9,
    stock: 5,
    category: "Gaming",
    image: "/public/images/sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg",
    active: true
  },

  // Parlantes
  {
    name: "T-G Parlante Bluetooth Portátil TG-149 Rojo",
    description: "Parlante portátil T-G TG-149 en color rojo, Bluetooth 5.0, sonido estéreo, batería de 8 horas, resistente al agua IPX4.",
    price: 25000,
    basePrice: 23000,
    markup: 8.7,
    stock: 20,
    category: "Parlantes",
    image: "/public/images/t-g-parlante-bluetooth-portatil-tg-149-rojo.png",
    active: true
  },
  {
    name: "T-G Parlante Bluetooth Portátil TG-104 Negro",
    description: "Parlante portátil T-G TG-104 en color negro, Bluetooth 5.0, sonido estéreo, batería de 6 horas, diseño compacto.",
    price: 20000,
    basePrice: 18500,
    markup: 8.1,
    stock: 25,
    category: "Parlantes",
    image: "/public/images/t-g-parlante-bluetooth-portatil-tg-104-negro.png",
    active: true
  },

  // Hogar Inteligente
  {
    name: "Nexxt Bombilla LED Inteligente WiFi 220V A19",
    description: "Bombilla LED inteligente Nexxt, WiFi, 220V, control por app, cambio de color, temporizador, compatible con Alexa y Google Home.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 40,
    category: "Hogar Inteligente",
    image: "/public/images/nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg",
    active: true
  },
  {
    name: "Nexxt Cámara de Seguridad Interior Turret 2K 5MP",
    description: "Cámara de seguridad Nexxt interior tipo turret, resolución 2K 5MP, visión nocturna, detección de movimiento, audio bidireccional.",
    price: 35000,
    basePrice: 32000,
    markup: 9.4,
    stock: 12,
    category: "Hogar Inteligente",
    image: "/public/images/nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg",
    active: true
  },
  {
    name: "Nexxt Cámara de Seguridad Interior PTZ 2K",
    description: "Cámara de seguridad Nexxt interior PTZ, resolución 2K, 2.4/5GHz WiFi, rotación 360°, control remoto, visión nocturna.",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 8,
    category: "Hogar Inteligente",
    image: "/public/images/nexxt-camara-de-seguridad-interior-ptz-2k-2-4-5ghz.jpg",
    active: true
  },

  // Cocina
  {
    name: "Moulinex Cafetera Dolce Gusto Piccolo XS Negra",
    description: "Cafetera Moulinex Dolce Gusto Piccolo XS en color negro, sistema de cápsulas, preparación rápida, diseño compacto.",
    price: 85000,
    basePrice: 78000,
    markup: 9,
    stock: 10,
    category: "Cocina",
    image: "/public/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png",
    active: true
  },
  {
    name: "Moulinex Exprimidor Ultra Compact Negro",
    description: "Exprimidor Moulinex ultra compacto en color negro, motor potente, fácil limpieza, ideal para cítricos, diseño moderno.",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 15,
    category: "Cocina",
    image: "/public/images/moulinex-exprimidor-ultra-compact-negro.png",
    active: true
  },
  {
    name: "Moulinex Molinillo de Café",
    description: "Molinillo de café Moulinex, cuchillas de acero inoxidable, capacidad de 50g, molido fino para espresso, fácil limpieza.",
    price: 35000,
    basePrice: 32000,
    markup: 9.4,
    stock: 12,
    category: "Cocina",
    image: "/public/images/moulinex-molinillo-de-cafe.png",
    active: true
  },
  {
    name: "Moulinex Vita Tostadora 720W Negra",
    description: "Tostadora Moulinex Vita de 720W en color negro, 2 ranuras, control de tostado, bandeja extraíble, diseño elegante.",
    price: 25000,
    basePrice: 23000,
    markup: 8.7,
    stock: 18,
    category: "Cocina",
    image: "/public/images/moulinex-vita-tostadora-720w-negra.png",
    active: true
  },
  {
    name: "Xienan Kit Premium Vino",
    description: "Kit premium Xienan para vino, incluye sacacorchos, tapones, cortador de cápsulas, accesorios de alta calidad para enófilos.",
    price: 18000,
    basePrice: 16500,
    markup: 9.1,
    stock: 25,
    category: "Cocina",
    image: "/public/images/xienan-kit-premium-vino-saca-corcho-tapones-cortad.png",
    active: true
  },

  // Muebles y Escritorio
  {
    name: "Xtech Silla Minnie Mouse Edition Licencia Disney",
    description: "Silla gaming Xtech edición Minnie Mouse con licencia oficial Disney, respaldo ergonómico, asiento acolchado, diseño exclusivo.",
    price: 95000,
    basePrice: 87000,
    markup: 9.2,
    stock: 8,
    category: "Muebles",
    image: "/public/images/xtech-silla-minnie-mouse-edition-licencia-disney-o.png",
    active: true
  },
  {
    name: "Xtech Silla Spider-Man Miles Morales Edition",
    description: "Silla gaming Xtech edición Spider-Man Miles Morales con licencia oficial, respaldo ergonómico, asiento acolchado, diseño temático.",
    price: 98000,
    basePrice: 90000,
    markup: 8.9,
    stock: 6,
    category: "Muebles",
    image: "/public/images/xtech-silla-spider-man-miles-morales-edition-licen.png",
    active: true
  },
  {
    name: "Xtech Escritorio Un Nivel Natural Beige",
    description: "Escritorio Xtech de un nivel en color natural beige, madera maciza, diseño minimalista, ideal para home office.",
    price: 120000,
    basePrice: 110000,
    markup: 9.1,
    stock: 10,
    category: "Muebles",
    image: "/public/images/xtech-escritorio-un-nivel-natural-beige-am100xtk20.png",
    active: true
  },
  {
    name: "Klip Xtreme Soporte Monitor 17\" a 27\"",
    description: "Soporte para monitor Klip Xtreme compatible con pantallas de 17\" a 27\", ajustable en altura, inclinación y rotación.",
    price: 35000,
    basePrice: 32000,
    markup: 9.4,
    stock: 15,
    category: "Accesorio",
    image: "/public/images/klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png",
    active: true
  },

  // Accesorios para Auto
  {
    name: "Xiaomi Compresor Inflador Portátil 2 Black",
    description: "Compresor inflador portátil Xiaomi, color negro, inflado rápido, batería integrada, ideal para bicicletas y autos.",
    price: 28000,
    basePrice: 25500,
    markup: 9.8,
    stock: 20,
    category: "Accesorio",
    image: "/public/images/xiaomi-compresor-inflador-portatil-2-black.png",
    active: true
  },
  {
    name: "Foxbox Energy Charge 6.5K 3 en 1 Cargador",
    description: "Cargador Foxbox Energy Charge 6.5K 3 en 1, powerbank, cargador de pared y cargador de auto, múltiples puertos.",
    price: 22000,
    basePrice: 20000,
    markup: 10,
    stock: 18,
    category: "Accesorio",
    image: "/public/images/foxbox-energy-charge-6-5k-3-en-1-cargador-power-ba.png",
    active: true
  },
  {
    name: "Foxbox Arrancador para Vehículos 3 en 1",
    description: "Arrancador Foxbox para vehículos 3 en 1, powerbank, linterna LED, arrancador de emergencia, 20000mAh.",
    price: 85000,
    basePrice: 78000,
    markup: 9,
    stock: 8,
    category: "Accesorio",
    image: "/public/images/foxbox-arrancador-para-vehiculos-3-en-1-powerbank.png",
    active: true
  },
  {
    name: "Foxbox Ride Soporte para Auto con Carga Inalámbrica",
    description: "Soporte para auto Foxbox Ride con carga inalámbrica, ajustable, sujeción magnética, compatible con todos los celulares.",
    price: 18000,
    basePrice: 16500,
    markup: 9.1,
    stock: 25,
    category: "Accesorio",
    image: "/public/images/foxbox-ride-soporte-para-auto-con-carga-inalambric.jpg",
    active: true
  },
  {
    name: "Foxbox Soporte para Auto Sopapa Bracket Rojo/Azul",
    description: "Soporte para auto Foxbox con sopapa bracket en colores rojo y azul, ajustable, sujeción firme, fácil instalación.",
    price: 15000,
    basePrice: 13500,
    markup: 11.1,
    stock: 30,
    category: "Accesorio",
    image: "/public/images/foxbox-soporte-para-auto-sopapa-bracket-rojo-azul.png",
    active: true
  },
  {
    name: "Foxbox Engage Soporte Imantado para Celular",
    description: "Soporte imantado Foxbox Engage para celular en auto, imán potente, rotación 360°, fácil instalación y remoción.",
    price: 12000,
    basePrice: 11000,
    markup: 9.1,
    stock: 35,
    category: "Accesorio",
    image: "/public/images/foxbox-engage-soporte-imantado-para-celular-en-aut.jpg",
    active: true
  },

  // Herramientas
  {
    name: "Nisuta Kit de Herramientas 60 Piezas",
    description: "Kit de herramientas Nisuta con 60 piezas, maletín organizador, herramientas de calidad profesional, garantía incluida.",
    price: 45000,
    basePrice: 41000,
    markup: 9.8,
    stock: 12,
    category: "Herramientas",
    image: "/public/images/nisuta-kit-de-herramientas-60-piezas-ns-k8918-3.png",
    active: true
  },

  // Otros
  {
    name: "South Port Conservador Plegable",
    description: "Conservador plegable South Port, ideal para camping y viajes, capacidad de 20L, material resistente, fácil transporte.",
    price: 35000,
    basePrice: 32000,
    markup: 9.4,
    stock: 15,
    category: "Otros",
    image: "/public/images/south-port-conservador-plegable-hela0003.jpg",
    active: true
  },
  {
    name: "Gadnic Hamaca Paraguaya Colgante",
    description: "Hamaca paraguaya Gadnic colgante, tejida a mano, material resistente, ideal para exteriores, soporte hasta 150kg.",
    price: 28000,
    basePrice: 25500,
    markup: 9.8,
    stock: 20,
    category: "Otros",
    image: "/public/images/gadnic-hamaca-paraguaya-colgante.jpg",
    active: true
  },
  {
    name: "Gateway by Acer Ultra Slim R7 3700U 16GB 1TB SSD",
    description: "Notebook Gateway by Acer ultra slim, procesador AMD R7 3700U, 16GB RAM, 1TB SSD, diseño elegante y portátil.",
    price: 650000,
    basePrice: 590000,
    markup: 10.2,
    stock: 5,
    category: "Notebook",
    image: "/public/images/gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1.jpg",
    active: true
  }
];

async function addNewProducts() {
  try {
    console.log('🚀 Iniciando agregado de nuevos productos...\n');
    console.log(`📦 Total de productos a agregar: ${newProducts.length}\n`);

    let created = 0;
    let skipped = 0;

    for (const product of newProducts) {
      try {
        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findUnique({
          where: { name: product.name }
        });

        if (existingProduct) {
          console.log(`⏭️  Saltado: ${product.name} (ya existe)`);
          skipped++;
          continue;
        }

        // Crear el nuevo producto
        await prisma.product.create({
          data: product
        });

        console.log(`✅ Creado: ${product.name}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString()}`);
        console.log(`   📸 Imagen: ${product.image}`);
        created++;

      } catch (error) {
        console.error(`❌ Error creando ${product.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Proceso completado!`);
    console.log(`   ✅ Productos creados: ${created}`);
    console.log(`   ⏭️  Productos saltados: ${skipped}`);
    console.log(`   📊 Total procesados: ${newProducts.length}`);

  } catch (error) {
    console.error('❌ Error durante el proceso:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
addNewProducts(); 