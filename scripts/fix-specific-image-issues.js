/**
 * Script para corregir problemas específicos de imágenes
 * 
 * Corrige:
 * - Productos de Xiaomi Redmi A5 que tienen imagen de tablet
 * - Productos de Apple AirPods que tienen imagen de Apple Watch
 * - Categorías incorrectas
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Correcciones específicas
const SPECIFIC_FIXES = {
  // Xiaomi Redmi A5 - debe tener imagen de celular, no tablet
  'xiaomi-redmi-a5': {
    correctImage: 'xiaomi-redmi-a5-4-128gb-sandy-gold-de-regalo-carga.jpg',
    correctCategory: 'Celulares'
  },
  
  // Apple AirPods - debe tener imagen de auriculares, no Apple Watch
  'apple-airpods-pro': {
    correctImage: 'apple-earpods-3-5-mm-a1472.jpg', // Temporal hasta tener imagen de AirPods
    correctCategory: 'Accesorio'
  },
  
  // Xiaomi Redmi Note 13 - debe ser celular, no tablet
  'xiaomi-redmi-note-13': {
    correctImage: 'xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg',
    correctCategory: 'Celulares'
  },
  
  // Xiaomi Redmi A5 Ocean Blue - debe tener imagen correcta
  'xiaomi-redmi-a5-4gb-128gb-ocean-blue': {
    correctImage: 'xiaomi-redmi-a5-4-128gb-ocean-blue-de-regalo-carga.jpg',
    correctCategory: 'Celulares'
  },
  
  // Xiaomi Redmi Pad SE - debe ser tablet
  'xiaomi-redmi-pad-se': {
    correctImage: 'xiaomi-redmi-pad-se-8-7-6-128-grey.jpg',
    correctCategory: 'Tablets'
  },
  
  // Tablet Samsung Galaxy - debe ser tablet, no celular
  'tablet-samsung-galaxy': {
    correctImage: 'xiaomi-redmi-pad-se-8-7-6-128-grey.jpg', // Temporal
    correctCategory: 'Tablets'
  },
  
  // Apple Watch Series 9 - debe tener imagen correcta
  'apple-watch-series-9-gps-41mm': {
    correctImage: 'apple-watch-series-9-gps-41mm-aluminium-case-sport.jpg',
    correctCategory: 'Accesorio'
  },
  
  // Apple Watch SE 2nd Gen - debe tener imagen correcta
  'apple-watch-se-2nd-gen-gps-44mm': {
    correctImage: 'apple-watch-se-2nd-gen-gps-44mm-aluminium-case-spo.jpg',
    correctCategory: 'Accesorio'
  },
  
  // JBL Wave Flex - debe tener imagen correcta según color
  'jbl-wave-flex-white': {
    correctImage: 'jbl-wave-flex-white.png',
    correctCategory: 'Accesorio'
  },
  
  'jbl-wave-flex-black': {
    correctImage: 'jbl-wave-flex-black.png',
    correctCategory: 'Accesorio'
  },
  
  // T-G Parlante - debe tener imagen correcta según modelo
  't-g-parlante-bluetooth-portatil-tg-104-negro': {
    correctImage: 't-g-parlante-bluetooth-portatil-tg-104-negro.png',
    correctCategory: 'Parlantes'
  },
  
  't-g-parlante-bluetooth-portatil-tg-149-rojo': {
    correctImage: 't-g-parlante-bluetooth-portatil-tg-149-rojo.png',
    correctCategory: 'Parlantes'
  },
  
  // XTECH Parlante - debe tener imagen de parlante
  'xtech-parlante-bluetooth': {
    correctImage: 't-g-parlante-bluetooth-portatil-tg-104-negro.png',
    correctCategory: 'Parlantes'
  },
  
  // Moulinex - debe tener imagen correcta según producto
  'moulinex-cafetera-dolce-gusto-piccolo-xs-negra': {
    correctImage: 'moulinex-cafetera-dolce-gusto-piccolo-xs-negra.png',
    correctCategory: 'Cocina'
  },
  
  'moulinex-exprimidor-ultra-compact-negro': {
    correctImage: 'moulinex-exprimidor-ultra-compact-negro.png',
    correctCategory: 'Cocina'
  },
  
  'moulinex-molinillo-de-cafe': {
    correctImage: 'moulinex-molinillo-de-cafe.png',
    correctCategory: 'Cocina'
  },
  
  'moulinex-vita-tostadora-720w-negra': {
    correctImage: 'moulinex-vita-tostadora-720w-negra.png',
    correctCategory: 'Cocina'
  },
  
  // Foxbox - debe tener imagen correcta según producto
  'foxbox-energy-charge-6-5k-3-en-1-cargador': {
    correctImage: 'foxbox-energy-charge-6-5k-3-en-1-cargador-power-ba.png',
    correctCategory: 'Accesorio'
  },
  
  'foxbox-engage-soporte-imantado-para-celular': {
    correctImage: 'foxbox-engage-soporte-imantado-para-celular-en-aut.jpg',
    correctCategory: 'Accesorio'
  },
  
  'foxbox-ride-soporte-para-auto-con-carga-inalambrica': {
    correctImage: 'foxbox-ride-soporte-para-auto-con-carga-inalambric.jpg',
    correctCategory: 'Accesorio'
  },
  
  'foxbox-soporte-para-auto-sopapa-bracket-rojo-azul': {
    correctImage: 'foxbox-soporte-para-auto-sopapa-bracket-rojo-azul.png',
    correctCategory: 'Accesorio'
  },
  
  'foxbox-arrancador-para-vehiculos-3-en-1': {
    correctImage: 'foxbox-arrancador-para-vehiculos-3-en-1-powerbank.png',
    correctCategory: 'Accesorio'
  },
  
  // Nexxt - debe tener imagen correcta según producto
  'nexxt-bombilla-led-inteligente-wi-fi-220v-a19': {
    correctImage: 'nexxt-bombilla-led-inteligente-wi-fi-220v-a19-nhb.jpg',
    correctCategory: 'Domótica'
  },
  
  'nexxt-camara-de-seguridad-interior-ptz-2k': {
    correctImage: 'nexxt-camara-de-seguridad-interior-ptz-2k-2-4-5ghz.jpg',
    correctCategory: 'Domótica'
  },
  
  'nexxt-camara-de-seguridad-interior-turret-2k-5mp': {
    correctImage: 'nexxt-camara-de-seguridad-interior-turret-2k-5mp-i.jpg',
    correctCategory: 'Domótica'
  },
  
  // Scykei - debe tener imagen correcta según producto
  'scykei-civis-smartwatch-amoled-2-1': {
    correctImage: 'scykei-civis-by-ck-amoled-21-curvo-60hz-llamada-bl.jpg',
    correctCategory: 'Accesorio'
  },
  
  'scykei-movis-smartwatch-amoled-2-1': {
    correctImage: 'scykei-movis-by-ck-amoled-21-curvo-60hz-music-gps.jpg',
    correctCategory: 'Accesorio'
  },
  
  'scykei-malla-de-silicona-y-cuero-22mm': {
    correctImage: 'scykei-malla-de-silicona-y-cuero-22mm-apta-modelo.jpg',
    correctCategory: 'Accesorio'
  },
  
  // Xtech - debe tener imagen correcta según producto
  'xtech-silla-minnie-mouse-edition-licencia-disney': {
    correctImage: 'xtech-silla-minnie-mouse-edition-licencia-disney-o.png',
    correctCategory: 'Muebles'
  },
  
  'xtech-silla-spider-man-miles-morales-edition': {
    correctImage: 'xtech-silla-spider-man-miles-morales-edition-licen.png',
    correctCategory: 'Muebles'
  },
  
  // Nisuta - debe tener imagen correcta
  'nisuta-kit-de-herramientas-60-piezas': {
    correctImage: 'nisuta-kit-de-herramientas-60-piezas-ns-k8918.png',
    correctCategory: 'Herramientas'
  },
  
  // Sony PS5 - debe tener imagen correcta
  'sony-ps5-playstation-5-slim-1tb-digital': {
    correctImage: 'sony-ps5-playstation-5-slim-1-tb-digital-returnal.jpg',
    correctCategory: 'Gaming'
  },
  
  // Xienan - debe tener imagen correcta
  'xienan-kit-premium-vino': {
    correctImage: 'xienan-kit-premium-vino-saca-corcho-tapones-cortad.png',
    correctCategory: 'Cocina'
  },
  
  // Xiaomi Compresor - debe tener imagen correcta
  'xiaomi-compresor-inflador-portatil-2-black': {
    correctImage: 'xiaomi-compresor-inflador-portatil-2-black.png',
    correctCategory: 'Herramientas'
  },
  
  // Gadnic Hamaca - debe tener imagen correcta
  'gadnic-hamaca-paraguaya-colgante': {
    correctImage: 'gadnic-hamaca-paraguaya-colgante.jpg',
    correctCategory: 'Muebles'
  },
  
  // Gateway Laptop - debe tener imagen correcta
  'gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd': {
    correctImage: 'gateway-by-acer-ultra-slim-r7-3700u-16gb-1tb-ssd-1-1.jpg',
    correctCategory: 'Laptops'
  }
};

// Función para normalizar nombres de productos
function normalizeProductName(name) {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim();
}

// Función para encontrar la mejor coincidencia
function findBestMatch(productName, fixes) {
  const normalizedName = normalizeProductName(productName);
  
  // Buscar coincidencia exacta
  if (fixes[normalizedName]) {
    return fixes[normalizedName];
  }
  
  // Buscar coincidencia parcial
  for (const [key, fix] of Object.entries(fixes)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return fix;
    }
  }
  
  return null;
}

async function fixSpecificImageIssues() {
  try {
    console.log('🔧 CORRIGIENDO PROBLEMAS ESPECÍFICOS DE IMÁGENES');
    console.log('=' .repeat(60));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true }
    });
    
    console.log(`📦 Total de productos a revisar: ${products.length}\n`);
    
    let fixed = 0;
    let skipped = 0;
    const errors = [];
    
    for (const product of products) {
      try {
        const fix = findBestMatch(product.name, SPECIFIC_FIXES);
        
        if (fix) {
          const updates = {};
          let hasChanges = false;
          
          // Verificar si necesita actualizar imagen
          if (product.image !== `/images/${fix.correctImage}`) {
            updates.image = `/images/${fix.correctImage}`;
            hasChanges = true;
          }
          
          // Verificar si necesita actualizar categoría
          if (product.category !== fix.correctCategory) {
            updates.category = fix.correctCategory;
            hasChanges = true;
          }
          
          if (hasChanges) {
            await prisma.product.update({
              where: { id: product.id },
              data: updates
            });
            
            console.log(`✅ ${product.name}`);
            if (updates.image) {
              console.log(`   📸 Imagen: ${product.image} → ${updates.image}`);
            }
            if (updates.category) {
              console.log(`   🏷️  Categoría: ${product.category} → ${updates.category}`);
            }
            console.log('');
            
            fixed++;
          } else {
            console.log(`⏭️  ${product.name} (ya tiene imagen y categoría correctas)`);
            skipped++;
          }
        } else {
          console.log(`⏭️  ${product.name} (no requiere corrección específica)`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
        errors.push({ product: product.name, error: error.message });
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CORRECCIONES ESPECÍFICAS');
    console.log('=' .repeat(50));
    console.log(`✅ Productos corregidos: ${fixed}`);
    console.log(`⏭️  Productos sin cambios: ${skipped}`);
    console.log(`❌ Errores: ${errors.length}`);
    
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
fixSpecificImageIssues();
