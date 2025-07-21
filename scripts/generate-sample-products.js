#!/usr/bin/env node

/**
 * Script para generar un archivo CSV de ejemplo con productos
 * Útil para probar la funcionalidad de importación
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Generando archivo CSV de ejemplo con productos...\n');

// Productos de ejemplo
const sampleProducts = [
  {
    name: "Laptop HP Pavilion 15",
    description: "Laptop de alta gama con procesador Intel i7, 16GB RAM, 512GB SSD, pantalla 15.6 pulgadas Full HD",
    price: 450000,
    stock: 10,
    category: "Computadoras",
    image: "https://ejemplo.com/laptop-hp.jpg"
  },
  {
    name: "Mouse Gaming Logitech G502",
    description: "Mouse inalámbrico para gaming profesional con 25K DPI, RGB personalizable, 11 botones programables",
    price: 35000,
    stock: 25,
    category: "Periféricos",
    image: "https://ejemplo.com/mouse-logitech.jpg"
  },
  {
    name: "Monitor Samsung 24 pulgadas",
    description: "Monitor LED Full HD 1920x1080, 75Hz, FreeSync, panel VA, tiempo de respuesta 1ms",
    price: 85000,
    stock: 15,
    category: "Monitores",
    image: "https://ejemplo.com/monitor-samsung.jpg"
  },
  {
    name: "Teclado Mecánico Corsair K70",
    description: "Teclado mecánico RGB con switches Cherry MX Red, reposamuñecas magnético, teclas multimedia",
    price: 55000,
    stock: 20,
    category: "Periféricos",
    image: "https://ejemplo.com/teclado-corsair.jpg"
  },
  {
    name: "Auriculares HyperX Cloud II",
    description: "Auriculares gaming con sonido envolvente 7.1, micrófono desmontable, cable USB y 3.5mm",
    price: 28000,
    stock: 30,
    category: "Audio",
    image: "https://ejemplo.com/auriculares-hyperx.jpg"
  },
  {
    name: "Webcam Logitech C920",
    description: "Webcam Full HD 1080p, autofocus, micrófono integrado, compatible con Windows, Mac y Linux",
    price: 22000,
    stock: 18,
    category: "Periféricos",
    image: "https://ejemplo.com/webcam-logitech.jpg"
  },
  {
    name: "Disco SSD Samsung 1TB",
    description: "Disco sólido interno 1TB, velocidad de lectura 3500MB/s, escritura 3300MB/s, SATA III",
    price: 45000,
    stock: 12,
    category: "Almacenamiento",
    image: "https://ejemplo.com/ssd-samsung.jpg"
  },
  {
    name: "Memoria RAM Kingston 16GB",
    description: "Memoria RAM DDR4 16GB (2x8GB), 3200MHz, CL16, compatible con Intel y AMD",
    price: 18000,
    stock: 22,
    category: "Componentes",
    image: "https://ejemplo.com/ram-kingston.jpg"
  },
  {
    name: "Fuente de Poder EVGA 650W",
    description: "Fuente de poder 650W 80 Plus Gold, modular, ventilador de 135mm, protección completa",
    price: 32000,
    stock: 8,
    category: "Componentes",
    image: "https://ejemplo.com/fuente-evga.jpg"
  },
  {
    name: "Placa de Video RTX 3060",
    description: "Placa de video NVIDIA RTX 3060 12GB GDDR6, Ray Tracing, DLSS, ventiladores duales",
    price: 280000,
    stock: 5,
    category: "Componentes",
    image: "https://ejemplo.com/rtx-3060.jpg"
  },
  {
    name: "Router TP-Link Archer C7",
    description: "Router WiFi dual band AC1750, 2.4GHz + 5GHz, 3 antenas externas, puerto Gigabit",
    price: 15000,
    stock: 14,
    category: "Redes",
    image: "https://ejemplo.com/router-tplink.jpg"
  },
  {
    name: "Impresora HP LaserJet Pro",
    description: "Impresora láser monocromática, velocidad 20 ppm, WiFi, USB, tóner de alta capacidad",
    price: 95000,
    stock: 7,
    category: "Impresoras",
    image: "https://ejemplo.com/impresora-hp.jpg"
  },
  {
    name: "Tablet Samsung Galaxy Tab A",
    description: "Tablet 10.1 pulgadas, Android 11, 3GB RAM, 32GB almacenamiento, WiFi + 4G",
    price: 65000,
    stock: 11,
    category: "Tablets",
    image: "https://ejemplo.com/tablet-samsung.jpg"
  },
  {
    name: "Smartphone Xiaomi Redmi Note",
    description: "Smartphone 6.67 pulgadas, 128GB, 6GB RAM, cámara 48MP, batería 5000mAh, Android 11",
    price: 85000,
    stock: 16,
    category: "Smartphones",
    image: "https://ejemplo.com/xiaomi-redmi.jpg"
  },
  {
    name: "Smart TV LG 43 pulgadas",
    description: "Smart TV 43 pulgadas 4K UHD, webOS, Netflix, YouTube, 3 HDMI, WiFi integrado",
    price: 120000,
    stock: 9,
    category: "TVs",
    image: "https://ejemplo.com/smart-tv-lg.jpg"
  }
];

// Convertir a formato CSV
const csvHeader = 'name,description,price,stock,category,image\n';
const csvRows = sampleProducts.map(product => {
  // Escapar comillas en los campos
  const name = `"${product.name.replace(/"/g, '""')}"`;
  const description = `"${product.description.replace(/"/g, '""')}"`;
  const image = `"${product.image}"`;
  
  return `${name},${description},${product.price},${product.stock},"${product.category}",${image}`;
}).join('\n');

const csvContent = csvHeader + csvRows;

// Guardar archivo
const outputPath = path.join(process.cwd(), 'sample-products.csv');

try {
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  console.log('✅ Archivo CSV generado exitosamente:');
  console.log(`📁 Ubicación: ${outputPath}`);
  console.log(`📊 Productos incluidos: ${sampleProducts.length}`);
  
  console.log('\n📋 Categorías incluidas:');
  const categories = [...new Set(sampleProducts.map(p => p.category))];
  categories.forEach(cat => {
    const count = sampleProducts.filter(p => p.category === cat).length;
    console.log(`   • ${cat}: ${count} productos`);
  });
  
  console.log('\n💰 Rango de precios:');
  const prices = sampleProducts.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  console.log(`   • Mínimo: $${minPrice.toLocaleString()}`);
  console.log(`   • Máximo: $${maxPrice.toLocaleString()}`);
  
  console.log('\n🚀 Cómo usar:');
  console.log('1. Ve al panel de administración');
  console.log('2. Haz clic en "Importar Productos"');
  console.log('3. Sube este archivo CSV');
  console.log('4. Revisa la vista previa');
  console.log('5. Confirma la importación');
  
  console.log('\n📧 Notificaciones:');
  console.log('• Todos los resultados se enviarán a: it360tecnologia@gmail.com');
  
} catch (error) {
  console.error('❌ Error al generar el archivo CSV:', error.message);
  console.log('\n📝 Contenido del CSV:');
  console.log('='.repeat(50));
  console.log(csvContent);
  console.log('='.repeat(50));
} 