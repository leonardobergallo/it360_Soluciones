#!/usr/bin/env node

/**
 * Script para crear productos de muestra
 * Genera productos de diferentes categorías para probar el sistema
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleProducts() {
  console.log('🚀 Creando productos de muestra...\n');

  try {
    // Verificar si ya existen productos
    const existingProducts = await prisma.product.findMany();
    console.log(`📋 Productos existentes: ${existingProducts.length}`);

    if (existingProducts.length > 0) {
      console.log('✅ Ya existen productos en la base de datos');
      console.log('📦 Productos disponibles:');
      existingProducts.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - $${product.price} - ${product.category}`);
      });
      return;
    }

    // Crear productos de muestra
    const sampleProducts = [
      {
        name: "Monitor LED 24\" Samsung",
        description: "Monitor LED de 24 pulgadas con resolución Full HD, perfecto para trabajo y gaming",
        price: 45000,
        stock: 15,
        category: "Monitores",
        image: "/servicio-productos.png",
        active: true
      },
      {
        name: "Teclado Mecánico RGB",
        description: "Teclado mecánico con switches Cherry MX Blue y retroiluminación RGB personalizable",
        price: 25000,
        stock: 25,
        category: "Periferico",
        image: "/servicio-pc.png",
        active: true
      },
      {
        name: "Mouse Gaming Logitech",
        description: "Mouse gaming con sensor óptico de alta precisión y 6 botones programables",
        price: 18000,
        stock: 30,
        category: "Periferico",
        image: "/servicio-software.png",
        active: true
      },
      {
        name: "Laptop HP Pavilion",
        description: "Laptop de 15.6 pulgadas con procesador Intel i5, 8GB RAM y SSD de 256GB",
        price: 120000,
        stock: 8,
        category: "Notebook",
        image: "/servicio-productos.png",
        active: true
      },
      {
        name: "Auriculares Bluetooth Sony",
        description: "Auriculares inalámbricos con cancelación de ruido y 30 horas de batería",
        price: 35000,
        stock: 20,
        category: "Accesorio",
        image: "/servicio-pc.png",
        active: true
      },
      {
        name: "Impresora HP LaserJet",
        description: "Impresora láser monocromática, ideal para oficina y uso doméstico",
        price: 55000,
        stock: 12,
        category: "Impresora",
        image: "/servicio-software.png",
        active: true
      },
      {
        name: "Disco Duro Externo 1TB",
        description: "Disco duro externo de 1TB con conexión USB 3.0, perfecto para respaldos",
        price: 15000,
        stock: 40,
        category: "Almacena",
        image: "/servicio-productos.png",
        active: true
      },
      {
        name: "Tablet Samsung Galaxy",
        description: "Tablet de 10.1 pulgadas con Android, ideal para trabajo y entretenimiento",
        price: 75000,
        stock: 10,
        category: "Tablets",
        image: "/servicio-pc.png",
        active: true
      },
      {
        name: "Router WiFi 6",
        description: "Router de última generación con WiFi 6, cobertura extendida y control parental",
        price: 28000,
        stock: 18,
        category: "Redes",
        image: "/servicio-software.png",
        active: true
      },
      {
        name: "Parlantes Bluetooth JBL",
        description: "Parlantes portátiles con sonido envolvente y resistencia al agua",
        price: 22000,
        stock: 25,
        category: "Parlantes",
        image: "/servicio-productos.png",
        active: true
      }
    ];

    console.log('📦 Creando productos...');
    
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData
      });
      console.log(`   ✅ Creado: ${product.name} - $${product.price}`);
    }

    console.log('\n🎉 ¡Productos de muestra creados exitosamente!');
    console.log(`📊 Total de productos: ${sampleProducts.length}`);
    
    console.log('\n📋 Categorías disponibles:');
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    categories.forEach(category => {
      const count = sampleProducts.filter(p => p.category === category).length;
      console.log(`   • ${category}: ${count} productos`);
    });

    console.log('\n🌐 Ahora puedes ver los productos en: http://localhost:3000/catalogo');

  } catch (error) {
    console.error('❌ Error creando productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleProducts(); 