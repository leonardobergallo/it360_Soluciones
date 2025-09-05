/**
 * Sistema Inteligente de Asignación de Imágenes
 * 
 * Características:
 * - Mapeo inteligente de productos con imágenes
 * - Algoritmo de coincidencia por palabras clave
 * - Validación de existencia de imágenes
 * - Corrección automática de categorías
 * - Reporte detallado de cambios
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Mapeo inteligente de productos con imágenes específicas
const SMART_IMAGE_MAPPING = {
  // === CELULARES ===
  'xiaomi-redmi-a5': {
    images: ['xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg', 'xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg'],
    category: 'Celulares',
    keywords: ['xiaomi', 'redmi', 'a5']
  },
  'xiaomi-redmi-pad': {
    images: ['xiaomi-redmi-pad-se-8-7-6-128-grey.jpg', 'xiaomi-redmi-pad-se-8-7-6-128-sim-card-grey.jpg'],
    category: 'Tablets',
    keywords: ['xiaomi', 'redmi', 'pad']
  },
  'iphone-15-pro': {
    images: ['apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg'], // Temporal - necesitamos imagen de iPhone
    category: 'Celulares',
    keywords: ['iphone', 'apple', '15', 'pro']
  },
  'samsung-galaxy-s24': {
    images: ['scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg'], // Temporal - necesitamos imagen de Samsung
    category: 'Celulares',
    keywords: ['samsung', 'galaxy', 's24']
  },
  'samsung-galaxy-s24-ultra': {
    images: ['scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg'], // Temporal
    category: 'Celulares',
    keywords: ['samsung', 'galaxy', 's24', 'ultra']
  },

  // === AURICULARES ===
  'lenovo-auricular-bt-lp3-pro': {
    images: ['lenovo-auricular-bt-lp3-pro-black.jpg'],
    category: 'Accesorio',
    keywords: ['lenovo', 'auricular', 'lp3', 'pro']
  },
  'lenovo-auricular-bt-supraaural': {
    images: ['lenovo-auricular-bt-supraaural-ta330-black.jpg'],
    category: 'Accesorio',
    keywords: ['lenovo', 'auricular', 'supraaural', 'ta330']
  },
  'lenovo-auricular-bt-x3-pro': {
    images: ['lenovo-auricular-bt-x3-pro-conduccion-osea-ip56-ne.jpg'],
    category: 'Accesorio',
    keywords: ['lenovo', 'auricular', 'x3', 'pro']
  },
  'lenovo-auricular-gaming-xg02': {
    images: ['lenovo-auricular-gaming-xg02-cancelacion-de-ruido.jpg'],
    category: 'Accesorio',
    keywords: ['lenovo', 'auricular', 'gaming', 'xg02']
  },
  'lenovo-auricular-lp40-pro': {
    images: ['lenovo-auricular-lp40-pro-cancelacion-de-ruido-ipx.png'],
    category: 'Accesorio',
    keywords: ['lenovo', 'auricular', 'lp40', 'pro']
  },
  'jbl-wave-flex': {
    images: ['jbl-wave-flex-white.png', 'jbl-wave-flex-black.png'],
    category: 'Accesorio',
    keywords: ['jbl', 'wave', 'flex']
  },
  'klip-xtreme-auriculares-edgebuds-pro': {
    images: ['klip-xtreme-auriculares-edgebuds-pro-carga-inalamb.png'],
    category: 'Accesorio',
    keywords: ['klip', 'xtreme', 'auriculares', 'edgebuds', 'pro']
  },
  'klip-xtreme-auricular-zoundbuds': {
    images: ['klip-xtreme-auricular-zoundbuds-ipx4-azul.jpg'],
    category: 'Accesorio',
    keywords: ['klip', 'xtreme', 'auricular', 'zoundbuds']
  },
  'klip-xtreme-auricular-touchbuds': {
    images: ['klip-xtreme-auricular-touchbuds-ipx3-verde-agua.jpg'],
    category: 'Accesorio',
    keywords: ['klip', 'xtreme', 'auricular', 'touchbuds']
  },
  'klip-xtreme-xtremebuds': {
    images: ['klip-xtreme-xtremebuds-auriculares-deportivos-bt-n.jpg'],
    category: 'Accesorio',
    keywords: ['klip', 'xtreme', 'xtremebuds', 'auriculares', 'deportivos']
  },
  'auricular-bluetooth-pop-it': {
    images: ['auricular-bluetooth-pop-it-st91-varios-colores.png'],
    category: 'Accesorio',
    keywords: ['auricular', 'bluetooth', 'pop', 'it']
  },
  'monster-auricular-xkt03': {
    images: ['monster-auricular-xkt03-cancelacion-de-ruido-baja.png'],
    category: 'Accesorio',
    keywords: ['monster', 'auricular', 'xkt03']
  },
  'foxbox-auriculares-boost-link-pro': {
    images: ['foxbox-auriculares-boost-link-pro-microfono-contro.jpg'],
    category: 'Accesorio',
    keywords: ['foxbox', 'auriculares', 'boost', 'link', 'pro']
  },
  'foxbox-auriculares-boost-pop': {
    images: ['foxbox-auriculares-boost-pop-microfono-3-5mm-negro.jpg'],
    category: 'Accesorio',
    keywords: ['foxbox', 'auriculares', 'boost', 'pop']
  },
  'alo-auriculares-sharp': {
    images: ['alo-auriculares-sharp-3-5mm-microfono-colores-vari.jpg'],
    category: 'Accesorio',
    keywords: ['alo', 'auriculares', 'sharp']
  },
  'p47-auricular-inalambrico': {
    images: ['p47-auricular-inalambrico-bluetooth-azul.jpg', 'p47-auricular-inalambrico-bluetooth-blanco.jpg', 'p47-auricular-inalambrico-bluetooth-rojo.jpg', 'p47-auricular-inalambrico-bluetooth-verde.jpg'],
    category: 'Accesorio',
    keywords: ['p47', 'auricular', 'inalambrico', 'bluetooth']
  },
  'apple-earpods': {
    images: ['apple-earpods-3-5-mm-a1472.jpg'],
    category: 'Accesorio',
    keywords: ['apple', 'earpods']
  },

  // === MONITORES ===
  'monitor': {
    images: ['klip-xtreme-soporte-monitor-17-a-27-pulg-p-escrito.png'],
    category: 'Monitores',
    keywords: ['monitor', 'pantalla', 'led', 'gaming']
  },

  // === PARLANTES ===
  't-g-parlante-bluetooth-tg-104': {
    images: ['t-g-parlante-bluetooth-portatil-tg-104-negro.png'],
    category: 'Parlantes',
    keywords: ['t-g', 'parlante', 'bluetooth', 'tg-104']
  },
  't-g-parlante-bluetooth-tg-149': {
    images: ['t-g-parlante-bluetooth-portatil-tg-149-rojo.png'],
    category: 'Parlantes',
    keywords: ['t-g', 'parlante', 'bluetooth', 'tg-149']
  },
  'jbl-flip-6': {
    images: ['jbl-wave-flex-black.png'], // Temporal - usar imagen de JBL
    category: 'Parlantes',
    keywords: ['jbl', 'flip', '6']
  },

  // === COCINA ===
  'moulinex-cafetera-dolce-gusto': {
    images: ['moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png'],
    category: 'Cocina',
    keywords: ['moulinex', 'cafetera', 'dolce', 'gusto']
  },
  'moulinex-exprimidor-ultra-compact': {
    images: ['moulinex-exprimidor-ultra-compact-negro.png'],
    category: 'Cocina',
    keywords: ['moulinex', 'exprimidor', 'ultra', 'compact']
  },
  'moulinex-molinillo-de-cafe': {
    images: ['moulinex-molinillo-de-cafe.png'],
    category: 'Cocina',
    keywords: ['moulinex', 'molinillo', 'cafe']
  },
  'moulinex-vita-tostadora': {
    images: ['moulinex-vita-tostadora-720w-negra.png'],
    category: 'Cocina',
    keywords: ['moulinex', 'vita', 'tostadora']
  },

  // === RELOJES INTELIGENTES ===
  'apple-watch-se-2nd-gen': {
    images: ['apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg'],
    category: 'Accesorio',
    keywords: ['apple', 'watch', 'se', '2nd', 'gen']
  },
  'apple-watch-series-9': {
    images: ['apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg'],
    category: 'Accesorio',
    keywords: ['apple', 'watch', 'series', '9']
  },
  'scykei-civis': {
    images: ['scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg'],
    category: 'Accesorio',
    keywords: ['scykei', 'civis', 'smartwatch', 'amoled']
  },
  'scykei-movis': {
    images: ['scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg'],
    category: 'Accesorio',
    keywords: ['scykei', 'movis', 'smartwatch', 'amoled']
  },
  'scykei-malla-silicona-cuero': {
    images: ['scykei-malla-de-silicona-y-cuero-22mm-apta-modelo.jpg'],
    category: 'Accesorio',
    keywords: ['scykei', 'malla', 'silicona', 'cuero']
  },
  'imiki-st1': {
    images: ['imiki-by-imilab-st1-178-amoled-funcion-llamada-ip6.jpg'],
    category: 'Accesorio',
    keywords: ['imiki', 'imilab', 'st1', 'smartwatch']
  },
  'imiki-st2': {
    images: ['imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-a.jpg', 'imiki-by-imilab-st2-196-tft-funcion-llamada-ip68-r.jpg'],
    category: 'Accesorio',
    keywords: ['imiki', 'imilab', 'st2', 'smartwatch']
  },
  'imiki-tg1': {
    images: ['imiki-by-imilab-tg1-143-amoled-funcion-llamada-ip6.jpg'],
    category: 'Accesorio',
    keywords: ['imiki', 'imilab', 'tg1', 'smartwatch']
  },
  'imiki-tg2': {
    images: ['imiki-by-imilab-tg2-143-amoled-funcion-llamada-ip6.jpg'],
    category: 'Accesorio',
    keywords: ['imiki', 'imilab', 'tg2', 'smartwatch']
  },

  // === ACCESORIOS PARA AUTO ===
  'foxbox-engage-soporte-imantado': {
    images: ['foxbox-engage-soporte-imantado-para-celular-en-aut.jpg'],
    category: 'Accesorio',
    keywords: ['foxbox', 'engage', 'soporte', 'imantado', 'celular', 'auto']
  },
  'foxbox-ride-soporte-auto-carga': {
    images: ['foxbox-ride-soporte-para-auto-con-carga-inalambric.jpg'],
    category: 'Accesorio',
    keywords: ['foxbox', 'ride', 'soporte', 'auto', 'carga', 'inalambrica']
  },
  'foxbox-soporte-auto-sopapa': {
    images: ['foxbox-soporte-para-auto-sopapa-bracket-rojo-azul.png'],
    category: 'Accesorio',
    keywords: ['foxbox', 'soporte', 'auto', 'sopapa', 'bracket']
  },
  'foxbox-arrancador-vehiculos': {
    images: ['foxbox-arrancador-para-vehiculos-3-en-1-powerbank.png'],
    category: 'Accesorio',
    keywords: ['foxbox', 'arrancador', 'vehiculos', 'powerbank']
  },
  'foxbox-energy-charge': {
    images: ['foxbox-energy-charge-6-5k-3-en-1-cargador-power-ba.png'],
    category: 'Accesorio',
    keywords: ['foxbox', 'energy', 'charge', 'cargador', 'powerbank']
  },

  // === DOMÓTICA ===
  'nexxt-bombilla-led-inteligente': {
    images: ['nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg'],
    category: 'Domótica',
    keywords: ['nexxt', 'bombilla', 'led', 'inteligente', 'wifi']
  },
  'nexxt-camara-seguridad-ptz': {
    images: ['nexxt-camara-de-seguridad-interior-ptz-2k-2-4-5ghz.jpg'],
    category: 'Domótica',
    keywords: ['nexxt', 'camara', 'seguridad', 'ptz', '2k']
  },
  'nexxt-camara-seguridad-turret': {
    images: ['nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg'],
    category: 'Domótica',
    keywords: ['nexxt', 'camara', 'seguridad', 'turret', '2k', '5mp']
  },

  // === MUEBLES ===
  'xtech-escritorio-un-nivel': {
    images: ['xtech-escritorio-un-nivel-natural-beige-am100xtk20.png'],
    category: 'Muebles',
    keywords: ['xtech', 'escritorio', 'nivel', 'natural', 'beige']
  },
  'xtech-silla-minnie-mouse': {
    images: ['xtech-silla-minnie-mouse-edition-licencia-disney-o.png'],
    category: 'Muebles',
    keywords: ['xtech', 'silla', 'minnie', 'mouse', 'disney']
  },
  'xtech-silla-spider-man': {
    images: ['xtech-silla-spider-man-miles-morales-edition-licen.png'],
    category: 'Muebles',
    keywords: ['xtech', 'silla', 'spider', 'man', 'miles', 'morales']
  },

  // === HERRAMIENTAS ===
  'nisuta-kit-herramientas': {
    images: ['nisuta-kit-de-herramientas-60-piezas-ns-k8918.png'],
    category: 'Herramientas',
    keywords: ['nisuta', 'kit', 'herramientas', '60', 'piezas']
  },

  // === GAMING ===
  'sony-ps5-playstation-5': {
    images: ['sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg'],
    category: 'Gaming',
    keywords: ['sony', 'ps5', 'playstation', '5', 'slim']
  },

  // === VINOS ===
  'xienan-kit-premium-vino': {
    images: ['xienan-kit-premium-vino-saca-corcho-tapones-cortad.png'],
    category: 'Cocina',
    keywords: ['xienan', 'kit', 'premium', 'vino', 'saca', 'corcho']
  },

  // === COMPRESOR ===
  'xiaomi-compresor-inflador': {
    images: ['xiaomi-compresor-inflador-portatil-2-black.png'],
    category: 'Herramientas',
    keywords: ['xiaomi', 'compresor', 'inflador', 'portatil']
  },

  // === HAMACA ===
  'gadnic-hamaca-paraguaya': {
    images: ['gadnic-hamaca-paraguaya-colgante.jpg'],
    category: 'Muebles',
    keywords: ['gadnic', 'hamaca', 'paraguaya', 'colgante']
  },

  // === LAPTOP ===
  'gateway-by-acer-ultra-slim': {
    images: ['gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1-1.jpg'],
    category: 'Laptops',
    keywords: ['gateway', 'acer', 'ultra', 'slim', 'laptop']
  }
};

// Función para calcular similitud entre strings
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1;
  
  // Algoritmo de Levenshtein simplificado
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Función para encontrar la mejor imagen para un producto
function findBestImageForProduct(productName, availableImages) {
  const productNameLower = productName.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;
  
  // Buscar en el mapeo inteligente
  for (const [key, mapping] of Object.entries(SMART_IMAGE_MAPPING)) {
    const similarity = calculateSimilarity(productNameLower, key);
    
    if (similarity > bestScore && similarity > 0.6) {
      // Verificar si alguna de las imágenes sugeridas existe
      for (const image of mapping.images) {
        if (availableImages.includes(image)) {
          bestMatch = {
            image: `/images/${image}`,
            category: mapping.category,
            score: similarity,
            method: 'smart_mapping'
          };
          bestScore = similarity;
          break;
        }
      }
    }
  }
  
  // Si no hay coincidencia en el mapeo, buscar por palabras clave
  if (!bestMatch) {
    const productWords = productNameLower.split(/[\s\-_]+/).filter(word => word.length > 2);
    
    for (const [key, mapping] of Object.entries(SMART_IMAGE_MAPPING)) {
      const keywordMatches = mapping.keywords.filter(keyword => 
        productWords.some(word => word.includes(keyword) || keyword.includes(word))
      );
      
      if (keywordMatches.length >= 2) {
        for (const image of mapping.images) {
          if (availableImages.includes(image)) {
            bestMatch = {
              image: `/images/${image}`,
              category: mapping.category,
              score: keywordMatches.length / mapping.keywords.length,
              method: 'keyword_matching'
            };
            break;
          }
        }
      }
    }
  }
  
  return bestMatch;
}

// Función principal
async function smartImageAssignment() {
  try {
    console.log('🎯 SISTEMA INTELIGENTE DE ASIGNACIÓN DE IMÁGENES');
    console.log('=' .repeat(60));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true }
    });
    
    console.log(`📦 Total de productos a procesar: ${products.length}\n`);
    
    // Leer directorio de imágenes
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    const availableImages = fs.readdirSync(imagesDir).filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    console.log(`📸 Imágenes disponibles: ${availableImages.length}\n`);
    
    let updated = 0;
    let categoryUpdated = 0;
    let skipped = 0;
    const errors = [];
    const changes = [];
    
    for (const product of products) {
      try {
        const bestMatch = findBestImageForProduct(product.name, availableImages);
        
        if (bestMatch) {
          const updates = {};
          let hasChanges = false;
          
          // Actualizar imagen si es diferente
          if (product.image !== bestMatch.image) {
            updates.image = bestMatch.image;
            hasChanges = true;
          }
          
          // Actualizar categoría si es diferente
          if (product.category !== bestMatch.category) {
            updates.category = bestMatch.category;
            hasChanges = true;
            categoryUpdated++;
          }
          
          if (hasChanges) {
            await prisma.product.update({
              where: { id: product.id },
              data: updates
            });
            
            changes.push({
              product: product.name,
              oldImage: product.image,
              newImage: bestMatch.image,
              oldCategory: product.category,
              newCategory: bestMatch.category,
              method: bestMatch.method,
              score: bestMatch.score
            });
            
            console.log(`✅ ${product.name}`);
            console.log(`   📸 Imagen: ${product.image} → ${bestMatch.image}`);
            if (updates.category) {
              console.log(`   🏷️  Categoría: ${product.category} → ${bestMatch.category}`);
            }
            console.log(`   🎯 Método: ${bestMatch.method} (Score: ${(bestMatch.score * 100).toFixed(1)}%)`);
            console.log('');
            
            updated++;
          } else {
            console.log(`⏭️  ${product.name} (ya tiene imagen y categoría correctas)`);
            skipped++;
          }
        } else {
          console.log(`❓ ${product.name} (no se encontró imagen adecuada)`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
        errors.push({ product: product.name, error: error.message });
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE ASIGNACIÓN INTELIGENTE');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    console.log(`🏷️  Categorías corregidas: ${categoryUpdated}`);
    console.log(`⏭️  Productos sin cambios: ${skipped}`);
    console.log(`❌ Errores: ${errors.length}`);
    
    // Mostrar cambios por método
    const methodStats = {};
    changes.forEach(change => {
      methodStats[change.method] = (methodStats[change.method] || 0) + 1;
    });
    
    console.log('\n🎯 CAMBIOS POR MÉTODO:');
    Object.entries(methodStats).forEach(([method, count]) => {
      console.log(`   ${method}: ${count} productos`);
    });
    
    // Mostrar algunos ejemplos de cambios
    if (changes.length > 0) {
      console.log('\n📋 EJEMPLOS DE CAMBIOS REALIZADOS:');
      changes.slice(0, 10).forEach((change, index) => {
        console.log(`${index + 1}. ${change.product}`);
        console.log(`   📸 ${change.oldImage} → ${change.newImage}`);
        if (change.oldCategory !== change.newCategory) {
          console.log(`   🏷️  ${change.oldCategory} → ${change.newCategory}`);
        }
        console.log(`   🎯 ${change.method} (${(change.score * 100).toFixed(1)}%)`);
        console.log('');
      });
    }
    
    if (errors.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.product}: ${error.error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
smartImageAssignment();
