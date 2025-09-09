const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Base de datos de precios de mercado (misma que el análisis anterior)
const marketPrices = {
  // iPhones
  "APPLE iPhone 15 Pro": { price: 1200000, source: "MercadoLibre", category: "Celulares" },
  "iPhone 15 Pro": { price: 1200000, source: "MercadoLibre", category: "Celulares" },
  
  // MacBooks
  "MacBook Air M2": { price: 1800000, source: "MercadoLibre", category: "Notebooks" },
  "MacBook Pro M3": { price: 2500000, source: "MercadoLibre", category: "Notebooks" },
  
  // Samsung Galaxy
  "Samsung Galaxy S24 Ultra": { price: 950000, source: "MercadoLibre", category: "Celulares" },
  "Samsung Galaxy S24": { price: 750000, source: "MercadoLibre", category: "Celulares" },
  "Samsung Galaxy A54": { price: 350000, source: "MercadoLibre", category: "Celulares" },
  
  // Apple Watch
  "Apple Watch SE 2nd Gen GPS 44mm": { price: 180000, source: "MercadoLibre", category: "Wearables" },
  "Apple Watch Series 9 GPS 41mm": { price: 450000, source: "MercadoLibre", category: "Wearables" },
  "Apple Watch Series 9 GPS 45mm": { price: 480000, source: "MercadoLibre", category: "Wearables" },
  
  // AirPods
  "Apple AirPods Pro": { price: 100000, source: "MercadoLibre", category: "Audio" },
  "Apple AirPods 3rd Gen": { price: 80000, source: "MercadoLibre", category: "Audio" },
  
  // Auriculares
  "Lenovo Auricular BT LP3 Pro Black": { price: 450000, source: "MercadoLibre", category: "Audio" },
  "Auricular Bluetooth": { price: 120000, source: "MercadoLibre", category: "Audio" },
  "Sony WH-1000XM5": { price: 350000, source: "MercadoLibre", category: "Audio" },
  "Sony WH-1000XM4": { price: 300000, source: "MercadoLibre", category: "Audio" },
  
  // Gaming
  "Sony PS5 PlayStation 5 Slim 1TB Digital": { price: 850000, source: "MercadoLibre", category: "Gaming" },
  "Sony PS5 PlayStation 5 Slim 1TB": { price: 950000, source: "MercadoLibre", category: "Gaming" },
  "Xbox Series X": { price: 800000, source: "MercadoLibre", category: "Gaming" },
  "Nintendo Switch OLED": { price: 400000, source: "MercadoLibre", category: "Gaming" },
  
  // Periféricos
  "Mouse Gaming Logitech": { price: 250000, source: "MercadoLibre", category: "Periféricos" },
  "Teclado Mecánico Gaming": { price: 150000, source: "MercadoLibre", category: "Periféricos" },
  "Mouse Inalámbrico": { price: 80000, source: "MercadoLibre", category: "Periféricos" },
  
  // Notebooks
  "Dell Inspiron 15": { price: 800000, source: "MercadoLibre", category: "Notebooks" },
  "HP Pavilion 15": { price: 750000, source: "MercadoLibre", category: "Notebooks" },
  "Lenovo ThinkPad E15": { price: 900000, source: "MercadoLibre", category: "Notebooks" },
  
  // Impresoras
  "BROTHER Impresora Láser": { price: 550000, source: "MercadoLibre", category: "Impresoras" },
  "Canon Impresora Láser Color": { price: 150000, source: "MercadoLibre", category: "Impresoras" },
  "HP LaserJet Pro": { price: 200000, source: "MercadoLibre", category: "Impresoras" },
  
  // Cámaras y Webcams
  "Cámara Web HD": { price: 120000, source: "MercadoLibre", category: "Cámaras" },
  "Logitech C920 HD Pro": { price: 150000, source: "MercadoLibre", category: "Cámaras" },
  "Nexxt Cámara de Seguridad Interior Turret 2K 5MP": { price: 120000, source: "MercadoLibre", category: "Cámaras" },
  
  // Accesorios
  "Foxbox Arrancador para Vehículos 3 en 1": { price: 90000, source: "MercadoLibre", category: "Accesorios" },
  "Foxbox Energy Charge 6.5K 3 en 1 Cargador": { price: 150000, source: "MercadoLibre", category: "Accesorios" },
  "Cargador Inalámbrico": { price: 50000, source: "MercadoLibre", category: "Accesorios" },
  "Foxbox Engage Soporte Imantado para Celular": { price: 80000, source: "MercadoLibre", category: "Accesorios Auto" },
  "Foxbox Ride Soporte para Auto con Carga Inalámbrica": { price: 120000, source: "MercadoLibre", category: "Accesorios Auto" },
  "Foxbox Soporte para Auto Sopapa Bracket Rojo/Azul": { price: 150000, source: "MercadoLibre", category: "Accesorios Auto" },
  
  // Monitores
  "Monitor Samsung 24\"": { price: 200000, source: "MercadoLibre", category: "Monitores" },
  "Monitor LG 27\" 4K": { price: 350000, source: "MercadoLibre", category: "Monitores" },
  "Monitor Gaming ASUS 24\"": { price: 250000, source: "MercadoLibre", category: "Monitores" },
  
  // Tablets
  "iPad Air 5th Gen": { price: 600000, source: "MercadoLibre", category: "Tablets" },
  "Samsung Galaxy Tab S9": { price: 500000, source: "MercadoLibre", category: "Tablets" },
  "Xiaomi Redmi Pad SE 8.7\"": { price: 500000, source: "MercadoLibre", category: "Tablets" },
  
  // Smart Home
  "Google Nest Hub": { price: 80000, source: "MercadoLibre", category: "Smart Home" },
  "Amazon Echo Dot": { price: 60000, source: "MercadoLibre", category: "Smart Home" },
  
  // Almacenamiento
  "SSD Samsung 1TB": { price: 120000, source: "MercadoLibre", category: "Almacenamiento" },
  "Disco Externo 2TB": { price: 100000, source: "MercadoLibre", category: "Almacenamiento" },
  "SANDISK SSD 500GB": { price: 120000, source: "MercadoLibre", category: "Almacenamiento" },
  
  // Redes
  "Router WiFi 6": { price: 150000, source: "MercadoLibre", category: "Redes" },
  "Switch Gigabit 8 Puertos": { price: 80000, source: "MercadoLibre", category: "Redes" },
  
  // Software
  "Microsoft Office 365": { price: 50000, source: "MercadoLibre", category: "Software" },
  "Adobe Creative Cloud": { price: 80000, source: "MercadoLibre", category: "Software" },
  
  // Audio adicional
  "XTECH Parlante Bluetooth": { price: 100000, source: "MercadoLibre", category: "Audio" },
  "T-G Parlante Bluetooth Portátil TG-149 Rojo": { price: 100000, source: "MercadoLibre", category: "Audio" },
  "JBL Flip 6": { price: 100000, source: "MercadoLibre", category: "Audio" },
  
  // Muebles
  "Xtech Silla Spider-Man Miles Morales Edition": { price: 150000, source: "MercadoLibre", category: "Muebles" },
  "Xtech Silla Minnie Mouse Edition Licencia Disney": { price: 80000, source: "MercadoLibre", category: "Muebles" },
  "Xtech Escritorio Un Nivel Natural Beige": { price: 150000, source: "MercadoLibre", category: "Muebles" },
  
  // Smartwatches
  "Scykei Civis Smartwatch AMOLED 2.1\"": { price: 150000, source: "MercadoLibre", category: "Smartwatches" },
  
  // Accesorios adicionales
  "Klip Xtreme Soporte Monitor 17\"": { price: 200000, source: "MercadoLibre", category: "Otros" },
  "Xiaomi Compresor Inflador Portátil 2 Black": { price: 500000, source: "MercadoLibre", category: "Otros" }
};

// Función para buscar precio aproximado (misma lógica que antes)
function findApproximatePrice(productName, category) {
  const name = productName.toLowerCase();
  
  if (name.includes('iphone')) {
    if (name.includes('15 pro')) return { price: 1200000, source: "Estimado", category: "Celulares" };
    if (name.includes('15')) return { price: 1000000, source: "Estimado", category: "Celulares" };
    if (name.includes('14')) return { price: 800000, source: "Estimado", category: "Celulares" };
    return { price: 600000, source: "Estimado", category: "Celulares" };
  }
  
  if (name.includes('macbook')) {
    if (name.includes('pro')) return { price: 2500000, source: "Estimado", category: "Notebooks" };
    if (name.includes('air')) return { price: 1800000, source: "Estimado", category: "Notebooks" };
    return { price: 2000000, source: "Estimado", category: "Notebooks" };
  }
  
  if (name.includes('samsung')) {
    if (name.includes('s24 ultra')) return { price: 950000, source: "Estimado", category: "Celulares" };
    if (name.includes('s24')) return { price: 750000, source: "Estimado", category: "Celulares" };
    if (name.includes('a54')) return { price: 350000, source: "Estimado", category: "Celulares" };
    if (name.includes('galaxy tab')) return { price: 500000, source: "Estimado", category: "Tablets" };
    return { price: 400000, source: "Estimado", category: "Celulares" };
  }
  
  if (name.includes('apple watch')) {
    if (name.includes('series 9')) return { price: 450000, source: "Estimado", category: "Wearables" };
    if (name.includes('se')) return { price: 180000, source: "Estimado", category: "Wearables" };
    return { price: 300000, source: "Estimado", category: "Wearables" };
  }
  
  if (name.includes('airpods')) {
    if (name.includes('pro')) return { price: 100000, source: "Estimado", category: "Audio" };
    return { price: 80000, source: "Estimado", category: "Audio" };
  }
  
  if (name.includes('ps5')) return { price: 850000, source: "Estimado", category: "Gaming" };
  if (name.includes('xbox')) return { price: 800000, source: "Estimado", category: "Gaming" };
  if (name.includes('nintendo switch')) return { price: 400000, source: "Estimado", category: "Gaming" };
  
  if (name.includes('mouse')) {
    if (name.includes('gaming')) return { price: 250000, source: "Estimado", category: "Periféricos" };
    return { price: 80000, source: "Estimado", category: "Periféricos" };
  }
  
  if (name.includes('teclado')) return { price: 150000, source: "Estimado", category: "Periféricos" };
  if (name.includes('monitor')) return { price: 200000, source: "Estimado", category: "Monitores" };
  if (name.includes('impresora')) return { price: 200000, source: "Estimado", category: "Impresoras" };
  if (name.includes('cámara web')) return { price: 120000, source: "Estimado", category: "Cámaras" };
  if (name.includes('auricular')) return { price: 120000, source: "Estimado", category: "Audio" };
  if (name.includes('cargador')) return { price: 50000, source: "Estimado", category: "Accesorios" };
  if (name.includes('router')) return { price: 150000, source: "Estimado", category: "Redes" };
  if (name.includes('ssd')) return { price: 120000, source: "Estimado", category: "Almacenamiento" };
  
  // Precios por categoría
  switch (category) {
    case 'Celulares': return { price: 500000, source: "Estimado por categoría", category: "Celulares" };
    case 'Notebooks': return { price: 1000000, source: "Estimado por categoría", category: "Notebooks" };
    case 'Gaming': return { price: 600000, source: "Estimado por categoría", category: "Gaming" };
    case 'Audio': return { price: 100000, source: "Estimado por categoría", category: "Audio" };
    case 'Periféricos': return { price: 100000, source: "Estimado por categoría", category: "Periféricos" };
    case 'Monitores': return { price: 200000, source: "Estimado por categoría", category: "Monitores" };
    case 'Impresoras': return { price: 200000, source: "Estimado por categoría", category: "Impresoras" };
    case 'Cámaras': return { price: 120000, source: "Estimado por categoría", category: "Cámaras" };
    case 'Accesorios': return { price: 80000, source: "Estimado por categoría", category: "Accesorios" };
    case 'Tablets': return { price: 400000, source: "Estimado por categoría", category: "Tablets" };
    case 'Smart Home': return { price: 70000, source: "Estimado por categoría", category: "Smart Home" };
    case 'Almacenamiento': return { price: 100000, source: "Estimado por categoría", category: "Almacenamiento" };
    case 'Redes': return { price: 100000, source: "Estimado por categoría", category: "Redes" };
    case 'Software': return { price: 60000, source: "Estimado por categoría", category: "Software" };
    case 'Wearables': return { price: 200000, source: "Estimado por categoría", category: "Wearables" };
    case 'Muebles': return { price: 150000, source: "Estimado por categoría", category: "Muebles" };
    case 'Smartwatches': return { price: 150000, source: "Estimado por categoría", category: "Smartwatches" };
    case 'Accesorios Auto': return { price: 100000, source: "Estimado por categoría", category: "Accesorios Auto" };
    case 'Electrodomésticos': return { price: 200000, source: "Estimado por categoría", category: "Electrodomésticos" };
    default: return { price: 150000, source: "Estimado general", category: "Otros" };
  }
}

// Función para calcular nuevo precio con margen competitivo
function calculateNewPrice(currentPrice, marketPrice, adjustmentType) {
  let newPrice;
  
  if (adjustmentType === 'HIGH') {
    // Para precios altos: reducir a precio de mercado + 15% de margen
    newPrice = marketPrice * 1.15;
  } else if (adjustmentType === 'LOW') {
    // Para precios bajos: aumentar a precio de mercado - 10% de margen
    newPrice = marketPrice * 0.90;
  } else {
    // Para precios competitivos: mantener con ajuste mínimo
    newPrice = currentPrice;
  }
  
  // Redondear a múltiplo de 1000 para precios más limpios
  return Math.round(newPrice / 1000) * 1000;
}

async function createAutomaticPriceAdjustment() {
  try {
    console.log('🔧 AJUSTE AUTOMÁTICO DE PRECIOS');
    console.log('===============================');
    
    // Obtener todos los productos activos
    const activeProducts = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, name: true, price: true, category: true },
      orderBy: { name: 'asc' }
    });
    
    console.log(`📊 Productos a analizar: ${activeProducts.length}`);
    
    const adjustments = [];
    const highPriceProducts = [];
    const lowPriceProducts = [];
    const competitiveProducts = [];
    
    // Analizar cada producto
    for (const product of activeProducts) {
      let marketData = marketPrices[product.name];
      
      if (!marketData) {
        marketData = findApproximatePrice(product.name, product.category);
      }
      
      if (marketData) {
        const currentPrice = product.price;
        const marketPrice = marketData.price;
        const priceDifferencePercentage = ((currentPrice - marketPrice) / marketPrice) * 100;
        
        let adjustmentType;
        let newPrice;
        
        if (priceDifferencePercentage > 20) {
          adjustmentType = 'HIGH';
          newPrice = calculateNewPrice(currentPrice, marketPrice, 'HIGH');
          highPriceProducts.push({
            ...product,
            marketPrice,
            priceDifferencePercentage,
            newPrice,
            adjustment: currentPrice - newPrice
          });
        } else if (priceDifferencePercentage < -20) {
          adjustmentType = 'LOW';
          newPrice = calculateNewPrice(currentPrice, marketPrice, 'LOW');
          lowPriceProducts.push({
            ...product,
            marketPrice,
            priceDifferencePercentage,
            newPrice,
            adjustment: newPrice - currentPrice
          });
        } else {
          adjustmentType = 'COMPETITIVE';
          newPrice = currentPrice;
          competitiveProducts.push({
            ...product,
            marketPrice,
            priceDifferencePercentage,
            newPrice,
            adjustment: 0
          });
        }
        
        if (newPrice !== currentPrice) {
          adjustments.push({
            id: product.id,
            name: product.name,
            currentPrice,
            newPrice,
            marketPrice,
            adjustment: newPrice - currentPrice,
            adjustmentPercentage: ((newPrice - currentPrice) / currentPrice) * 100,
            type: adjustmentType
          });
        }
      }
    }
    
    console.log(`\n📊 ANÁLISIS COMPLETADO:`);
    console.log(`🔴 Productos con precios altos: ${highPriceProducts.length}`);
    console.log(`🟢 Productos con precios bajos: ${lowPriceProducts.length}`);
    console.log(`🟡 Productos competitivos: ${competitiveProducts.length}`);
    console.log(`🔧 Ajustes necesarios: ${adjustments.length}`);
    
    if (adjustments.length > 0) {
      console.log('\n🔧 APLICANDO AJUSTES AUTOMÁTICOS...');
      console.log('==================================');
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const adjustment of adjustments) {
        try {
          await prisma.product.update({
            where: { id: adjustment.id },
            data: { price: adjustment.newPrice }
          });
          
          console.log(`✅ ${adjustment.name}`);
          console.log(`   Precio anterior: $${adjustment.currentPrice.toFixed(2)}`);
          console.log(`   Precio nuevo: $${adjustment.newPrice.toFixed(2)}`);
          console.log(`   Ajuste: ${adjustment.adjustment > 0 ? '+' : ''}$${adjustment.adjustment.toFixed(2)} (${adjustment.adjustmentPercentage.toFixed(1)}%)`);
          console.log(`   Tipo: ${adjustment.type}`);
          console.log('');
          
          successCount++;
        } catch (error) {
          console.log(`❌ Error ajustando ${adjustment.name}: ${error.message}`);
          errorCount++;
        }
      }
      
      console.log(`\n📊 RESUMEN DE AJUSTES:`);
      console.log(`✅ Ajustes exitosos: ${successCount}`);
      console.log(`❌ Errores: ${errorCount}`);
      
      // Estadísticas de ahorro/ganancia
      const totalSavings = adjustments
        .filter(a => a.type === 'HIGH')
        .reduce((sum, a) => sum + a.adjustment, 0);
      
      const totalGains = adjustments
        .filter(a => a.type === 'LOW')
        .reduce((sum, a) => sum + a.adjustment, 0);
      
      console.log(`\n💰 IMPACTO FINANCIERO:`);
      console.log(`💸 Ahorro por precios altos: $${totalSavings.toFixed(2)}`);
      console.log(`💵 Ganancia por precios bajos: $${totalGains.toFixed(2)}`);
      console.log(`📈 Impacto neto: $${(totalGains - totalSavings).toFixed(2)}`);
      
    } else {
      console.log('\n✅ No se requieren ajustes automáticos');
    }
    
    console.log('\n💡 RECOMENDACIONES POST-AJUSTE:');
    console.log('===============================');
    console.log('1. 📊 Monitorear ventas en los próximos días');
    console.log('2. 🔍 Verificar precios manualmente en MercadoLibre');
    console.log('3. 📈 Ajustar según comportamiento del mercado');
    console.log('4. 🔄 Revisar precios semanalmente');
    console.log('5. 📱 Considerar promociones para productos con precios altos');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAutomaticPriceAdjustment();
