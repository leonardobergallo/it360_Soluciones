/**
 * Script para corregir productos con precios en $0
 * 
 * Este script:
 * 1. Identifica productos con precio $0
 * 2. Aplica precios realistas basados en categoría y tipo de producto
 * 3. Usa el sistema de precios optimizado que implementamos
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Precios base por categoría (en pesos argentinos)
const CATEGORY_BASE_PRICES = {
  'Celulares': {
    'xiaomi-redmi-a5': 150000,
    'xiaomi-redmi-note-13': 200000,
    'samsung-galaxy-s24': 800000,
    'samsung-galaxy-s24-ultra': 1200000,
    'iphone-15-pro': 1500000,
    'motorola-moto-g84': 180000,
    'default': 200000
  },
  'Tablets': {
    'xiaomi-redmi-pad-se': 180000,
    'samsung-galaxy-tab': 250000,
    'ipad': 400000,
    'default': 200000
  },
  'Accesorio': {
    'apple-watch': 300000,
    'apple-airpods': 150000,
    'lenovo-auricular': 25000,
    'jbl-wave-flex': 35000,
    'klip-xtreme-auricular': 20000,
    'monster-auricular': 45000,
    'foxbox-auricular': 30000,
    'alo-auricular': 15000,
    'p47-auricular': 12000,
    'apple-earpods': 18000,
    'scykei-smartwatch': 80000,
    'imiki-smartwatch': 60000,
    'default': 25000
  },
  'Monitores': {
    'monitor-24': 120000,
    'monitor-27': 180000,
    'monitor-32': 250000,
    'monitor-34': 350000,
    'monitor-gaming': 200000,
    'monitor-dell': 150000,
    'monitor-lg': 160000,
    'monitor-samsung': 170000,
    'default': 150000
  },
  'Parlantes': {
    'jbl-flip': 45000,
    't-g-parlante': 25000,
    'xtech-parlante': 30000,
    'default': 30000
  },
  'Cocina': {
    'moulinex-cafetera': 80000,
    'moulinex-exprimidor': 45000,
    'moulinex-molinillo': 35000,
    'moulinex-tostadora': 25000,
    'xienan-kit-vino': 15000,
    'default': 40000
  },
  'Domótica': {
    'nexxt-bombilla': 8000,
    'nexxt-camara': 25000,
    'nexxt-cerradura': 40000,
    'nexxt-sensor': 8000,
    'default': 15000
  },
  'Gaming': {
    'sony-ps5': 800000,
    'default': 500000
  },
  'Herramientas': {
    'xiaomi-compresor': 60000,
    'nisuta-kit-herramientas': 25000,
    'default': 30000
  },
  'Laptops': {
    'gateway-acer': 600000,
    'lenovo-thinkpad': 500000,
    'dell-inspiron': 450000,
    'macbook-air': 800000,
    'default': 500000
  },
  'Muebles': {
    'xtech-escritorio': 80000,
    'xtech-silla': 60000,
    'gadnic-hamaca': 40000,
    'default': 50000
  },
  'Almacena': {
    'wd-ssd': 80000,
    'sandisk-ssd': 70000,
    'seagate-hdd': 60000,
    'default': 70000
  },
  'Redes': {
    'router-wifi': 50000,
    'switch-gigabit': 30000,
    'default': 40000
  },
  'Impresora': {
    'brother-laser': 80000,
    'canon-laser': 90000,
    'hp-multifuncion': 70000,
    'default': 80000
  },
  'Periferico': {
    'mouse-gaming': 15000,
    'teclado-mecanico': 20000,
    'default': 15000
  },
  'Otros': {
    'camara-web': 15000,
    'default': 20000
  }
};

// Función para obtener precio base según producto y categoría
function getBasePrice(productName, category) {
  const name = productName.toLowerCase();
  const categoryPrices = CATEGORY_BASE_PRICES[category];
  
  if (!categoryPrices) {
    return CATEGORY_BASE_PRICES['Otros'].default;
  }
  
  // Buscar coincidencia específica
  for (const [key, price] of Object.entries(categoryPrices)) {
    if (key !== 'default' && name.includes(key.toLowerCase())) {
      return price;
    }
  }
  
  return categoryPrices.default;
}

// Función para calcular precio final con markup
function calculateFinalPrice(basePrice, category) {
  // Markup por categoría
  const markups = {
    'Celulares': 0.15,      // 15%
    'Tablets': 0.20,        // 20%
    'Accesorio': 0.30,      // 30%
    'Monitores': 0.25,      // 25%
    'Parlantes': 0.35,      // 35%
    'Cocina': 0.40,         // 40%
    'Domótica': 0.50,       // 50%
    'Gaming': 0.20,         // 20%
    'Herramientas': 0.45,   // 45%
    'Laptops': 0.15,        // 15%
    'Muebles': 0.50,        // 50%
    'Almacena': 0.30,       // 30%
    'Redes': 0.35,          // 35%
    'Impresora': 0.25,      // 25%
    'Periferico': 0.40,     // 40%
    'Otros': 0.30           // 30%
  };
  
  const markup = markups[category] || 0.30;
  return Math.round(basePrice * (1 + markup) / 100) * 100; // Redondear a múltiplos de 100
}

async function fixZeroPrices() {
  try {
    console.log('🔧 CORRIGIENDO PRODUCTOS CON PRECIOS EN $0');
    console.log('=' .repeat(60));
    
    // Obtener productos con precio $0
    const productsWithZeroPrice = await prisma.product.findMany({
      where: { 
        price: 0,
        active: true
      }
    });
    
    console.log(`📦 Productos con precio $0 encontrados: ${productsWithZeroPrice.length}\n`);
    
    if (productsWithZeroPrice.length === 0) {
      console.log('✅ No hay productos con precio $0 que corregir');
      return;
    }
    
    let fixed = 0;
    let skipped = 0;
    const errors = [];
    
    for (const product of productsWithZeroPrice) {
      try {
        // Obtener precio base
        const basePrice = getBasePrice(product.name, product.category);
        
        // Calcular precio final
        const finalPrice = calculateFinalPrice(basePrice, product.category);
        
        // Calcular markup
        const markup = ((finalPrice - basePrice) / basePrice) * 100;
        
        // Actualizar producto
        await prisma.product.update({
          where: { id: product.id },
          data: {
            price: finalPrice,
            basePrice: basePrice,
            markup: Math.round(markup * 10) / 10 // Redondear a 1 decimal
          }
        });
        
        console.log(`✅ ${product.name}`);
        console.log(`   🏷️  Categoría: ${product.category}`);
        console.log(`   💰 Precio base: $${basePrice.toLocaleString('es-AR')}`);
        console.log(`   📈 Markup: ${markup.toFixed(1)}%`);
        console.log(`   💵 Precio final: $${finalPrice.toLocaleString('es-AR')}`);
        console.log('');
        
        fixed++;
      } catch (error) {
        console.error(`❌ Error corrigiendo ${product.name}:`, error.message);
        errors.push({ product: product.name, error: error.message });
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE CORRECCIÓN DE PRECIOS');
    console.log('=' .repeat(50));
    console.log(`✅ Productos corregidos: ${fixed}`);
    console.log(`⏭️  Productos saltados: ${skipped}`);
    console.log(`❌ Errores: ${errors.length}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  ERRORES ENCONTRADOS:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.product}: ${error.error}`);
      });
    }
    
    // Mostrar estadísticas por categoría
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    const categoryStats = {};
    productsWithZeroPrice.forEach(product => {
      if (!categoryStats[product.category]) {
        categoryStats[product.category] = 0;
      }
      categoryStats[product.category]++;
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} productos`);
    });
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixZeroPrices();
