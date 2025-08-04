const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapeo de productos a imágenes disponibles
const productImageMapping = {
  // Celulares
  'xiaomi-redmi-a5': '/public/images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg',
  'xiaomi-redmi-pad': '/public/images/xiaomi-redmi-pad-se-8-7-6-128-grey.jpg',
  'apple-watch': '/public/images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg',
  'apple-watch-series-9': '/public/images/apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg',
  
  // Auriculares
  'lenovo-auricular-bt-lp3-pro': '/public/images/lenovo-auricular-bt-lp3-pro-black.jpg',
  'lenovo-auricular-bt-x3-pro': '/public/images/lenovo-auricular-bt-x3-pro-conduccion-osea-ip56-ne.jpg',
  'lenovo-auricular-bt-supraaural': '/public/images/lenovo-auricular-bt-supraaural-ta330-black.jpg',
  'jbl-wave-flex-white': '/public/images/jbl-wave-flex-white.png',
  'jbl-wave-flex-black': '/public/images/jbl-wave-flex-black.png',
  'klip-xtreme-auriculares-edgebuds-pro': '/public/images/klip-xtreme-auriculares-edgebuds-pro-carga-inalamb-3.png',
  'klip-xtreme-auricular-zoundbuds': '/public/images/klip-xtreme-auricular-zoundbuds-ipx4-azul.jpg',
  'klip-xtreme-auricular-touchbuds': '/public/images/klip-xtreme-auricular-touchbuds-ipx3-verde-agua.jpg',
  'lenovo-auricular-gaming-xg02': '/public/images/lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg',
  'auricular-bluetooth-pop-it': '/public/images/auricular-bluetooth-pop-it-st91-varios-colores.png',
  'monster-auricular-xkt03': '/public/images/monster-auricular-xkt03-cancelacion-de-ruido-baja.png',
  'lenovo-auricular-lp40-pro': '/public/images/lenovo-auricular-lp40-pro-cancelacion-de-ruido-ipx-3.png',
  'foxbox-auriculares-boost-link-pro': '/public/images/foxbox-auriculares-boost-link-pro-microfono-contro.jpg',
  'alo-auriculares-sharp': '/public/images/alo-auriculares-sharp-3-5mm-microfono-colores-vari.jpg',
  'foxbox-auriculares-boost-pop': '/public/images/foxbox-auriculares-boost-pop-microfono-3-5mm-negro.jpg',
  'klip-xtreme-xtremebuds': '/public/images/klip-xtreme-xtremebuds-auriculares-deportivos-bt-n.jpg',
  'apple-earpods': '/public/images/apple-earpods-3-5-mm-a1472.jpg',
  'p47-auricular-inalambrico-bluetooth': '/public/images/p47-auricular-inalambrico-bluetooth-rojo.jpg',
  
  // Parlantes
  't-g-parlante-bluetooth-portatil-tg-149': '/public/images/t-g-parlante-bluetooth-portatil-tg-149-rojo.png',
  't-g-parlante-bluetooth-portatil-tg-104': '/public/images/t-g-parlante-bluetooth-portatil-tg-104-negro.png',
  'klip-xtreme-auriculares-style': '/public/images/klip-xtreme-auriculares-style-azul.png',
  
  // Gaming
  'sony-ps5-playstation-5-slim': '/public/images/sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg',
  
  // Smartwatches y relojes
  'scykei-civis-by-ck-amoled': '/public/images/scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg',
  'scykei-movis-by-ck-amoled': '/public/images/scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg',
  'scykei-malla-de-silicona': '/public/images/scykei-malla-de-silicona-y-cuero-22mm-apta-modelo.jpg',
  'imiki-by-imilab-st2': '/public/images/imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-r.jpg',
  'imiki-by-imilab-st1': '/public/images/imiki-by-imilab-st1-178-amoled-funcion-llamada-ip6.jpg',
  'imiki-by-imilab-tg2': '/public/images/imiki-by-imilab-tg2-143-amoled-funcion-llamada-ip6.jpg',
  'imiki-by-imilab-tg1': '/public/images/imiki-by-imilab-tg1-143-amoled-funcion-llamada-ip6.jpg',
  
  // Hogar inteligente
  'nexxt-bombilla-led-inteligente': '/public/images/nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg',
  'nexxt-camara-de-seguridad-interior-turret': '/public/images/nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg',
  'nexxt-camara-de-seguridad-interior-ptz': '/public/images/nexxt-camara-de-seguridad-interior-ptz-2k-2-4-5ghz.jpg',
  
  // Cocina
  'moulinex-cafetera-dolce-gusto': '/public/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png',
  'moulinex-exprimidor-ultra-compact': '/public/images/moulinex-exprimidor-ultra-compact-negro.png',
  'moulinex-molinillo-de-cafe': '/public/images/moulinex-molinillo-de-cafe.png',
  'moulinex-vita-tostadora': '/public/images/moulinex-vita-tostadora-720w-negra.png',
  'xienan-kit-premium-vino': '/public/images/xienan-kit-premium-vino-saca-corcho-tapones-cortad.png',
  
  // Muebles y escritorio
  'xtech-silla-minnie-mouse': '/public/images/xtech-silla-minnie-mouse-edition-licencia-disney-o.png',
  'xtech-silla-spider-man': '/public/images/xtech-silla-spider-man-miles-morales-edition-licen.png',
  'xtech-escritorio-un-nivel': '/public/images/xtech-escritorio-un-nivel-natural-beige-am100xtk20.png',
  'klip-xtreme-soporte-monitor': '/public/images/klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png',
  
  // Accesorios para auto
  'xiaomi-compresor-inflador': '/public/images/xiaomi-compresor-inflador-portatil-2-black.png',
  'foxbox-energy-charge': '/public/images/foxbox-energy-charge-6-5k-3-en-1-cargador-power-ba.png',
  'foxbox-arrancador-para-vehiculos': '/public/images/foxbox-arrancador-para-vehiculos-3-en-1-powerbank.png',
  'foxbox-ride-soporte-para-auto': '/public/images/foxbox-ride-soporte-para-auto-con-carga-inalambric.jpg',
  'foxbox-soporte-para-auto-sopapa': '/public/images/foxbox-soporte-para-auto-sopapa-bracket-rojo-azul.png',
  'foxbox-engage-soporte-imantado': '/public/images/foxbox-engage-soporte-imantado-para-celular-en-aut.jpg',
  
  // Herramientas
  'nisuta-kit-de-herramientas': '/public/images/nisuta-kit-de-herramientas-60-piezas-ns-k8918-3.png',
  
  // Otros
  'south-port-conservador': '/public/images/south-port-conservador-plegable-hela0003.jpg',
  'gadnic-hamaca-paraguaya': '/public/images/gadnic-hamaca-paraguaya-colgante.jpg',
  'gateway-by-acer-ultra-slim': '/public/images/gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1.jpg'
};

// Función para encontrar la imagen más apropiada basada en el nombre del producto
function findBestImageMatch(productName) {
  const nameLower = productName.toLowerCase();
  
  // Buscar coincidencias exactas primero
  for (const [key, imagePath] of Object.entries(productImageMapping)) {
    if (nameLower.includes(key.toLowerCase())) {
      return imagePath;
    }
  }
  
  // Buscar coincidencias parciales
  if (nameLower.includes('auricular') || nameLower.includes('headphone') || nameLower.includes('audífono')) {
    return '/public/images/lenovo-auricular-bt-lp3-pro-black.jpg';
  }
  
  if (nameLower.includes('parlante') || nameLower.includes('speaker')) {
    return '/public/images/t-g-parlante-bluetooth-portatil-tg-149-rojo.png';
  }
  
  if (nameLower.includes('celular') || nameLower.includes('smartphone') || nameLower.includes('iphone')) {
    return '/public/images/xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg';
  }
  
  if (nameLower.includes('tablet') || nameLower.includes('ipad')) {
    return '/public/images/xiaomi-redmi-pad-se-8-7-6-128-grey.jpg';
  }
  
  if (nameLower.includes('reloj') || nameLower.includes('watch')) {
    return '/public/images/apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg';
  }
  
  if (nameLower.includes('monitor') || nameLower.includes('pantalla')) {
    return '/public/images/gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1.jpg';
  }
  
  if (nameLower.includes('cafetera') || nameLower.includes('café')) {
    return '/public/images/moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png';
  }
  
  if (nameLower.includes('cámara') || nameLower.includes('camara')) {
    return '/public/images/nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg';
  }
  
  if (nameLower.includes('bombilla') || nameLower.includes('led')) {
    return '/public/images/nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg';
  }
  
  // Imagen por defecto
  return '/icono.png';
}

async function updateProductImages() {
  try {
    console.log('🔄 Iniciando actualización de imágenes de productos...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany();
    console.log(`📦 Total de productos encontrados: ${products.length}\n`);

    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      const bestImage = findBestImageMatch(product.name);
      
      // Solo actualizar si la imagen es diferente
      if (product.image !== bestImage) {
        await prisma.product.update({
          where: { id: product.id },
          data: { image: bestImage }
        });
        
        console.log(`✅ Actualizado: ${product.name}`);
        console.log(`   📸 Nueva imagen: ${bestImage}`);
        updated++;
      } else {
        console.log(`⏭️  Saltado: ${product.name} (ya tiene imagen apropiada)`);
        skipped++;
      }
    }

    console.log(`\n🎉 Actualización completada!`);
    console.log(`   ✅ Productos actualizados: ${updated}`);
    console.log(`   ⏭️  Productos saltados: ${skipped}`);
    console.log(`   📊 Total procesados: ${products.length}`);

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
updateProductImages(); 