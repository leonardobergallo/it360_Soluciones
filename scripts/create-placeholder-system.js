/**
 * Script para crear un sistema de imágenes placeholder
 * 
 * Este script:
 * 1. Crea imágenes placeholder con el nombre del producto
 * 2. Usa colores por categoría
 * 3. Genera imágenes dinámicamente
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Colores por categoría para los placeholders
const CATEGORY_COLORS = {
  'Celulares': '#3B82F6',      // Azul
  'Tablets': '#8B5CF6',        // Púrpura
  'Accesorio': '#10B981',      // Verde
  'Monitores': '#F59E0B',      // Amarillo
  'Parlantes': '#EF4444',      // Rojo
  'Cocina': '#F97316',         // Naranja
  'Domótica': '#06B6D4',       // Cian
  'Gaming': '#EC4899',         // Rosa
  'Herramientas': '#6B7280',   // Gris
  'Laptops': '#1F2937',        // Gris oscuro
  'Muebles': '#92400E',        // Marrón
  'Almacena': '#7C3AED',       // Violeta
  'Redes': '#059669',          // Verde esmeralda
  'Impresora': '#DC2626',      // Rojo oscuro
  'Periferico': '#7C2D12',     // Marrón oscuro
  'Otros': '#374151'           // Gris neutro
};

// Función para generar URL de placeholder
function generatePlaceholderUrl(productName, category) {
  const color = CATEGORY_COLORS[category] || CATEGORY_COLORS['Otros'];
  const text = encodeURIComponent(productName.substring(0, 20));
  const bgColor = color.replace('#', '');
  
  // Usar un servicio de placeholder como placeholder.com
  return `https://via.placeholder.com/300x300/${bgColor}/FFFFFF?text=${text}`;
}

async function createPlaceholderSystem() {
  try {
    console.log('🎨 CREANDO SISTEMA DE PLACEHOLDERS');
    console.log('=' .repeat(60));
    
    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { active: true }
    });
    
    console.log(`📦 Productos a procesar: ${products.length}`);
    console.log('');
    
    let updated = 0;
    const categoryStats = {};
    
    for (const product of products) {
      try {
        // Generar URL de placeholder
        const placeholderUrl = generatePlaceholderUrl(product.name, product.category);
        
        await prisma.product.update({
          where: { id: product.id },
          data: { image: placeholderUrl }
        });
        
        // Estadísticas
        if (!categoryStats[product.category]) {
          categoryStats[product.category] = 0;
        }
        categoryStats[product.category]++;
        
        updated++;
        
      } catch (error) {
        console.error(`❌ Error procesando ${product.name}:`, error.message);
      }
    }
    
    // Mostrar resumen
    console.log('\n📊 RESUMEN DE PLACEHOLDERS');
    console.log('=' .repeat(50));
    console.log(`✅ Productos actualizados: ${updated}`);
    
    console.log('\n📈 ESTADÍSTICAS POR CATEGORÍA:');
    Object.entries(categoryStats).forEach(([category, count]) => {
      const color = CATEGORY_COLORS[category] || CATEGORY_COLORS['Otros'];
      console.log(`   🎨 ${category}: ${count} productos (${color})`);
    });
    
    console.log('\n💡 VENTAJAS DE ESTE ENFOQUE:');
    console.log('   ✅ Cada producto tiene su imagen única');
    console.log('   ✅ Colores por categoría para fácil identificación');
    console.log('   ✅ No necesitas almacenar imágenes localmente');
    console.log('   ✅ Se generan dinámicamente');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
createPlaceholderSystem();
