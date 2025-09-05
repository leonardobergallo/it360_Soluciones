const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function checkAvailableProductPhotos() {
  try {
    console.log('🔍 Verificando productos con fotos disponibles en /images/...\n');

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      orderBy: {
        category: 'asc'
      }
    });

    console.log(`📦 Total de productos en la base de datos: ${products.length}\n`);

    // Leer el directorio de imágenes
    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    let imageFiles = [];
    
    try {
      imageFiles = fs.readdirSync(imagesDir);
      // Filtrar solo archivos de imagen
      imageFiles = imageFiles.filter(file => 
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );
    } catch (error) {
      console.error('❌ Error leyendo directorio de imágenes:', error.message);
      return;
    }

    console.log(`📸 Total de imágenes disponibles en /images/: ${imageFiles.length}\n`);

    // Productos que podrían tener fotos disponibles
    const productsWithPotentialPhotos = [];
    const productsWithoutPhotos = [];

    products.forEach(product => {
      // Buscar imágenes que coincidan con el nombre del producto
      const matchingImages = imageFiles.filter(imageFile => {
        const productNameLower = product.name.toLowerCase();
        const imageNameLower = imageFile.toLowerCase();
        
        // Buscar coincidencias por palabras clave
        const productWords = productNameLower.split(/[\s\-_]+/);
        const imageWords = imageNameLower.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').split(/[\s\-_]+/);
        
        // Verificar si hay palabras en común
        const commonWords = productWords.filter(word => 
          imageWords.some(imgWord => imgWord.includes(word) || word.includes(imgWord))
        );
        
        return commonWords.length > 0;
      });

      if (matchingImages.length > 0) {
        productsWithPotentialPhotos.push({
          product,
          matchingImages
        });
      } else {
        productsWithoutPhotos.push(product);
      }
    });

    console.log('🎯 PRODUCTOS CON FOTOS POTENCIALMENTE DISPONIBLES:');
    console.log('=' .repeat(70));
    
    if (productsWithPotentialPhotos.length > 0) {
      productsWithPotentialPhotos.forEach((item, index) => {
        const { product, matchingImages } = item;
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   🏷️  Categoría: ${product.category}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString()}`);
        console.log(`   📸 Fotos disponibles:`);
        matchingImages.forEach(img => {
          console.log(`      • ${img}`);
        });
        console.log('');
      });
    } else {
      console.log('❌ No se encontraron productos con fotos potencialmente disponibles\n');
    }

    console.log('⚠️  PRODUCTOS SIN FOTOS DISPONIBLES:');
    console.log('=' .repeat(50));
    
    if (productsWithoutPhotos.length > 0) {
      productsWithoutPhotos.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   🏷️  Categoría: ${product.category}`);
        console.log(`   💰 Precio: $${product.price.toLocaleString()}`);
        console.log('');
      });
    } else {
      console.log('✅ Todos los productos tienen fotos disponibles\n');
    }

    // Mostrar todas las imágenes disponibles
    console.log('📸 TODAS LAS IMÁGENES DISPONIBLES EN /images/:');
    console.log('=' .repeat(50));
    
    // Agrupar por tipo de producto
    const imageGroups = {};
    imageFiles.forEach(imageFile => {
      const fileName = imageFile.toLowerCase();
      
      if (fileName.includes('xiaomi') || fileName.includes('redmi')) {
        if (!imageGroups['Xiaomi']) imageGroups['Xiaomi'] = [];
        imageGroups['Xiaomi'].push(imageFile);
      } else if (fileName.includes('lenovo')) {
        if (!imageGroups['Lenovo']) imageGroups['Lenovo'] = [];
        imageGroups['Lenovo'].push(imageFile);
      } else if (fileName.includes('auricular') || fileName.includes('headphone')) {
        if (!imageGroups['Auriculares']) imageGroups['Auriculares'] = [];
        imageGroups['Auriculares'].push(imageFile);
      } else if (fileName.includes('monitor') || fileName.includes('display')) {
        if (!imageGroups['Monitores']) imageGroups['Monitores'] = [];
        imageGroups['Monitores'].push(imageFile);
      } else if (fileName.includes('notebook') || fileName.includes('laptop')) {
        if (!imageGroups['Notebooks']) imageGroups['Notebooks'] = [];
        imageGroups['Notebooks'].push(imageFile);
      } else if (fileName.includes('celular') || fileName.includes('smartphone')) {
        if (!imageGroups['Celulares']) imageGroups['Celulares'] = [];
        imageGroups['Celulares'].push(imageFile);
      } else {
        if (!imageGroups['Otros']) imageGroups['Otros'] = [];
        imageGroups['Otros'].push(imageFile);
      }
    });

    Object.entries(imageGroups).forEach(([group, images]) => {
      console.log(`${group}:`);
      images.forEach(img => {
        console.log(`   📸 ${img}`);
      });
      console.log('');
    });

    // Resumen final
    console.log('📊 RESUMEN FINAL:');
    console.log('=' .repeat(30));
    console.log(`📦 Productos totales: ${products.length}`);
    console.log(`✅ Con fotos potenciales: ${productsWithPotentialPhotos.length}`);
    console.log(`❌ Sin fotos disponibles: ${productsWithoutPhotos.length}`);
    console.log(`📸 Imágenes totales: ${imageFiles.length}`);
    console.log(`📊 Cobertura: ${Math.round((productsWithPotentialPhotos.length / products.length) * 100)}%`);

    console.log('\n🎉 Verificación completada!');

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkAvailableProductPhotos();
