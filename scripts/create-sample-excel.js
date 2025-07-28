const XLSX = require('xlsx');

// Datos de ejemplo para el archivo Excel
const sampleProducts = [
  {
    name: 'Laptop HP Pavilion Gaming',
    description: 'Laptop gaming con procesador Intel i7, 16GB RAM, 512GB SSD, NVIDIA GTX 1650',
    basePrice: 120000,
    category: 'hardware',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
  },
  {
    name: 'Mouse Gaming RGB',
    description: 'Mouse gaming inalámbrico con 6 botones, RGB personalizable, 12000 DPI',
    basePrice: 15000,
    category: 'perifericos',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
  },
  {
    name: 'Teclado Mecánico Cherry MX',
    description: 'Teclado mecánico con switches Cherry MX Red, retroiluminación RGB, teclas PBT',
    basePrice: 25000,
    category: 'perifericos',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400'
  },
  {
    name: 'Monitor Samsung 27" 4K',
    description: 'Monitor 27" 4K UHD, HDR, FreeSync, 1ms, HDMI/DisplayPort',
    basePrice: 180000,
    category: 'monitores',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
  },
  {
    name: 'SSD Samsung 1TB NVMe',
    description: 'SSD NVMe M.2 1TB, velocidad de lectura 3500MB/s, escritura 3300MB/s',
    basePrice: 45000,
    category: 'almacenamiento',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'
  },
  {
    name: 'Router WiFi 6 TP-Link',
    description: 'Router WiFi 6 AX3000, 3000 Mbps, 4 antenas, MU-MIMO, OFDMA',
    basePrice: 35000,
    category: 'redes',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Impresora HP LaserJet Pro',
    description: 'Impresora láser monocromática, WiFi, 22 ppm, tóner de alta capacidad',
    basePrice: 80000,
    category: 'impresoras',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Cable HDMI 2.1 3m',
    description: 'Cable HDMI 2.1 de alta velocidad, 8K, 48Gbps, dorado, 3 metros',
    basePrice: 8000,
    category: 'cables',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Auriculares Gaming HyperX',
    description: 'Auriculares gaming con micrófono desmontable, sonido envolvente 7.1, USB',
    basePrice: 22000,
    category: 'accesorios',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
  },
  {
    name: 'Webcam Logitech C920 Pro',
    description: 'Webcam HD 1080p, autofocus, micrófono dual, compatible con streaming',
    basePrice: 18000,
    category: 'perifericos',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  }
];

// Crear el archivo Excel
function createSampleExcel() {
  try {
    console.log('📊 Creando archivo Excel de ejemplo...\n');

    // Crear workbook
    const workbook = XLSX.utils.book_new();
    
    // Crear worksheet con los datos
    const worksheet = XLSX.utils.json_to_sheet(sampleProducts);
    
    // Agregar el worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    
    // Escribir el archivo
    const fileName = 'productos-ejemplo.xlsx';
    XLSX.writeFile(workbook, fileName);
    
    console.log('✅ Archivo Excel creado exitosamente!');
    console.log(`📁 Nombre del archivo: ${fileName}`);
    console.log(`📦 Productos incluidos: ${sampleProducts.length}`);
    console.log('\n📋 Categorías incluidas:');
    
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    categories.forEach(cat => {
      const count = sampleProducts.filter(p => p.category === cat).length;
      console.log(`   • ${cat}: ${count} productos`);
    });
    
    console.log('\n💡 Instrucciones:');
    console.log('1. Ve al panel de administración: /admin');
    console.log('2. Navega a "Importar Productos"');
    console.log('3. Sube este archivo Excel');
    console.log('4. Configura los markups por categoría');
    console.log('5. Revisa la vista previa y confirma la importación');
    
    console.log('\n🎯 Ejemplo de precios con markup:');
    console.log('• Hardware (25%): Laptop $120,000 → $150,000');
    console.log('• Periféricos (30%): Mouse $15,000 → $19,500');
    console.log('• Monitores (20%): Monitor $180,000 → $216,000');
    console.log('• Almacenamiento (35%): SSD $45,000 → $60,750');
    console.log('• Redes (40%): Router $35,000 → $49,000');
    console.log('• Impresoras (25%): Impresora $80,000 → $100,000');
    console.log('• Cables (50%): Cable $8,000 → $12,000');
    console.log('• Accesorios (45%): Auriculares $22,000 → $31,900');

  } catch (error) {
    console.error('❌ Error creando archivo Excel:', error);
  }
}

createSampleExcel(); 