const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Mapeo inteligente de productos a imágenes
const productImageMapping = {
  // Xiaomi
  'xiaomi-redmi-a5': ['xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg', 'xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg'],
  'xiaomi-redmi-pad': ['xiaomi-redmi-pad-se-8-7-6-128-grey.jpg', 'xiaomi-redmi-pad-se-8-7-6-128-sim-card-grey.jpg'],
  'xiaomi-compresor': ['xiaomi-compresor-inflador-portatil-2-black.png'],
  
  // Apple
  'apple-iphone': ['apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg', 'apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg'],
  'apple-watch': ['apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg', 'apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg'],
  'apple-airpods': ['apple-earpods-3-5-mm-a1472.jpg'],
  'iphone': ['apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg'],
  
  // Samsung
  'samsung-galaxy': ['scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg', 'scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg'],
  'samsung': ['scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg'],
  
  // Lenovo
  'lenovo-auricular': ['lenovo-auricular-bt-lp3-pro-black.jpg', 'lenovo-auricular-bt-supraaural-ta330-black.jpg', 'lenovo-auricular-bt-x3-pro-conduccion-osea-ip56-ne.jpg', 'lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg', 'lenovo-auricular-lp40-pro-cancelacion-de-ruido-ipx.png'],
  'lenovo': ['lenovo-auricular-bt-lp3-pro-black.jpg'],
  
  // Auriculares
  'auricular': ['lenovo-auricular-bt-lp3-pro-black.jpg', 'monster-auricular-xkt03-cancelacion-de-ruido-baja.png', 'klip-xtreme-auriculares-edgebuds-pro-carga-inalamb.png'],
  'airpods': ['lenovo-auricular-bt-lp3-pro-black.jpg'],
  'headset': ['lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg'],
  
  // Klip Xtreme
  'klip-xtreme': ['klip-xtreme-auriculares-edgebuds-pro-carga-inalamb.png', 'klip-xtreme-auriculares-style-azul.png', 'klip-xtreme-auricular-touchbuds-ipx3-verde-agua.jpg', 'klip-xtreme-auricular-zoundbuds-ipx4-azul.jpg'],
  
  // JBL
  'jbl': ['jbl-wave-flex-black.png', 'jbl-wave-flex-white.png'],
  'jbl-wave': ['jbl-wave-flex-black.png', 'jbl-wave-flex-white.png'],
  
  // Monitores
  'monitor': ['klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png'],
  'monitores': ['klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png'],
  
  // Gaming
  'gaming': ['lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg', 'monster-auricular-xkt03-cancelacion-de-ruido-baja.png'],
  'ps5': ['sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg'],
  'playstation': ['sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg'],
  
  // Domótica
  'nexxt': ['nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg', 'nexxt-camara-de-seguridad-interior-ptz-2k-2-4-5ghz.jpg', 'nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg'],
  'cámara': ['nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg'],
  'bombilla': ['nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg'],
  
  // Herramientas
  'nisuta': ['nisuta-kit-de-herramientas-60-piezas-ns-k8918.png'],
  'herramientas': ['nisuta-kit-de-herramientas-60-piezas-ns-k8918.png'],
  
  // Muebles
  'xtech-silla': ['xtech-silla-spider-man-miles-morales-edition-licen.png', 'xtech-silla-minnie-mouse-edition-licencia-disney-o.png'],
  'xtech-escritorio': ['xtech-escritorio-un-nivel-natural-beige-am100xtk20.png'],
  'silla': ['xtech-silla-spider-man-miles-morales-edition-licen.png'],
  'escritorio': ['xtech-escritorio-un-nivel-natural-beige-am100xtk20.png'],
  
  // Foxbox
  'foxbox': ['foxbox-arrancador-para-vehiculos-3-en-1-powerbank.png', 'foxbox-energy-charge-6-5k-3-en-1-cargador-power-ba.png', 'foxbox-engage-soporte-imantado-para-celular-en-aut.jpg', 'foxbox-ride-soporte-para-auto-con-carga-inalambric.jpg'],
  
  // Moulinex
  'moulinex': ['moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png', 'moulinex-molinillo-de-cafe.png', 'moulinex-exprimidor-ultra-compact-negro.png', 'moulinex-vita-tostadora-720w-negra.png'],
  'cafetera': ['moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png'],
  'molinillo': ['moulinex-molinillo-de-cafe.png'],
  'exprimidor': ['moulinex-exprimidor-ultra-compact-negro.png'],
  'tostadora': ['moulinex-vita-tostadora-720w-negra.png'],
  
  // Parlantes
  't-g-parlante': ['t-g-parlante-bluetooth-portatil-tg-104-negro.png', 't-g-parlante-bluetooth-portatil-tg-149-rojo.png'],
  'parlante': ['t-g-parlante-bluetooth-portatil-tg-104-negro.png'],
  
  // Smartwatches
  'scykei': ['scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg', 'scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg'],
  'smartwatch': ['scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg'],
  'reloj': ['scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg'],
  
  // Accesorios varios
  'p47-auricular': ['p47-auricular-inalambrico-bluetooth-blanco.jpg', 'p47-auricular-inalambrico-bluetooth-verde.jpg', 'p47-auricular-inalambrico-bluetooth-rojo.jpg', 'p47-auricular-inalambrico-bluetooth-azul.jpg'],
  'gadnic': ['gadnic-hamaca-paraguaya-colgante.jpg'],
  'xienan': ['xienan-kit-premium-vino-saca-corcho-tapones-cortad.png'],
  'south-port': ['south-port-conservador-plegable-hela0003.jpg']
};

async function assignSpecificImages() {
  try {
    console.log('🎯 ASIGNANDO IMÁGENES ESPECÍFICAS A PRODUCTOS...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: {
        active: true
      }
    });

    console.log(`📦 Total de productos a procesar: ${products.length}\n`);

    // Leer directorio de imágenes
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    const availableImages = fs.readdirSync(imagesDir).filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    console.log(`📸 Imágenes disponibles: ${availableImages.length}\n`);

    let updated = 0;
    let skipped = 0;
    const errors = [];

    for (const product of products) {
      try {
        // Buscar la mejor imagen para este producto
        const bestImage = findBestImageForProduct(product.name, availableImages);
        
        if (bestImage && product.image !== bestImage) {
          await prisma.product.update({
            where: { id: product.id },
            data: { image: bestImage }
          });
          
          console.log(`✅ ${product.name}`);
          console.log(`   📸 Nueva imagen: ${bestImage}`);
          updated++;
        } else {
          console.log(`⏭️  ${product.name} (ya tiene imagen apropiada)`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error actualizando ${product.name}:`, error.message);
        errors.push({ product: product.name, error: error.message });
      }
    }

    console.log('\n📊 RESUMEN DE ACTUALIZACIÓN:');
    console.log('=' .repeat(40));
    console.log(`✅ Productos actualizados: ${updated}`);
    console.log(`⏭️  Productos saltados: ${skipped}`);
    console.log(`❌ Errores: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      errors.forEach(error => {
        console.log(`   • ${error.product}: ${error.error}`);
      });
    }

    console.log('\n🎉 Proceso completado!');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function findBestImageForProduct(productName, availableImages) {
  const productNameLower = productName.toLowerCase();
  
  // Buscar coincidencias exactas en el mapeo
  for (const [key, images] of Object.entries(productImageMapping)) {
    if (productNameLower.includes(key.toLowerCase())) {
      // Buscar la primera imagen disponible
      for (const image of images) {
        if (availableImages.includes(image)) {
          return `/images/${image}`;
        }
      }
    }
  }
  
  // Búsqueda inteligente por palabras clave
  const productWords = productNameLower.split(/[\s\-_]+/);
  
  for (const image of availableImages) {
    const imageNameLower = image.toLowerCase();
    
    // Verificar si hay palabras en común
    const commonWords = productWords.filter(word => 
      word.length > 2 && imageNameLower.includes(word)
    );
    
    if (commonWords.length >= 2) {
      return `/images/${image}`;
    }
  }
  
  // Si no hay coincidencias, devolver null
  return null;
}

// Ejecutar el script
assignSpecificImages();
