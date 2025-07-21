// Script para importar productos con autenticación válida
const monitorProducts = [
  {
    categoría: "Monitores",
    nombre: "Monitor Gamer 27\" LG Full Hd 240Hz 1Ms | 27GP750-B",
    precio: "507500.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-gamer-27-lg-full-hd-240hz-1ms-27gp750-b/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:05",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor gamer 27\" lg full hd 240hz 1ms | 27gp750-b",
    repetido: "FALSE",
    mejor_precio: "507500",
    precio_con_markup: "735875",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Gamer 27\" LG UltraFine IPS 4K 60Hz 5Ms | 27US500-W",
    precio: "443210.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-gamer-27-lg-ultrafine-ips-4k-60hz-5ms-27us500-w/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:05",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor gamer 27\" lg ultrafine ips 4k 60hz 5ms | 27us500-w",
    repetido: "FALSE",
    mejor_precio: "443210",
    precio_con_markup: "642654.5",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Led 34\" LG Ultrawide WFHD 21:9 HDR10 75Hz 5Ms | 34WP500",
    precio: "591000.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-lg-21934-34wp500-b-ultra-wide-wfhd/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:05",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor led 34\" lg ultrawide wfhd 21:9 hdr10 75hz 5ms | 34wp500",
    repetido: "FALSE",
    mejor_precio: "591000",
    precio_con_markup: "856950",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Gamer 24\" LG Full Hd 180Hz 1Ms Freesync | 24GS60F",
    precio: "253330.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-gamer-24-lg-full-hd-180hz-1ms-freesync-24gs60f/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:05",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor gamer 24\" lg full hd 180hz 1ms freesync | 24gs60f",
    repetido: "FALSE",
    mejor_precio: "253330",
    precio_con_markup: "367328.5",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Gamer 24\" LG Full Hd IPS 100Hz 5Ms | 24MS500",
    precio: "182250.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-gamer-24-lg-full-hd-ips-100hz-5ms-24ms500/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:05",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor gamer 24\" lg full hd ips 100hz 5ms | 24ms500",
    repetido: "FALSE",
    mejor_precio: "182250",
    precio_con_markup: "264262.5",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Gamer 27\" LG UltraGear Ips QHD HDR10 200Hz 1Ms | 27GS75Q",
    precio: "475540.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-gamer-27-lg-ultragear-ips-qhd-hdr10-200hz-1ms-27gs75q/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:05",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor gamer 27\" lg ultragear ips qhd hdr10 200hz 1ms | 27gs75q",
    repetido: "FALSE",
    mejor_precio: "475540",
    precio_con_markup: "689533",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Led 19.5\" LG Hd 60Hz 5Ms | 20MK400",
    precio: "169100.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-led-19-5-lg-hd-60hz-5ms-20mk400/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:06",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor led 19.5\" lg hd 60hz 5ms | 20mk400",
    repetido: "FALSE",
    mejor_precio: "169100",
    precio_con_markup: "245195",
    mayorista_mejor_precio: "Guidotec"
  },
  {
    categoría: "Monitores",
    nombre: "Monitor Led 20\" LG Hd 75Hz 5Ms | 20U401A-B",
    precio: "148990.00",
    enlace: "https://www.guidotec.com.ar/productos/monitor-led-20-lg-hd-75hz-5ms-20u401a-b/",
    imagen: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
    fecha_extracción: "2025-07-16 13:48:06",
    mayorista: "Guidotec",
    nombre_normalizado: "monitor led 20\" lg hd 75hz 5ms | 20u401a-b",
    repetido: "FALSE",
    mejor_precio: "148990",
    precio_con_markup: "216035.5",
    mayorista_mejor_precio: "Guidotec"
  }
];

// Función para importar productos directamente en la base de datos
async function importProductsDirectly() {
  console.log('🚀 IMPORTANDO PRODUCTOS DIRECTAMENTE EN LA BASE DE DATOS');
  console.log('=====================================================\n');

  try {
    // Importar Prisma Client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    console.log('📊 Total de productos a importar:', monitorProducts.length);
    console.log('🔄 Iniciando importación...\n');

    let imported = 0;
    let updated = 0;
    const errors = [];

    for (const productData of monitorProducts) {
      try {
        // Mapear campos del CSV a la estructura de la base de datos
        const mappedProduct = {
          name: productData.nombre,
          description: `${productData.nombre} - ${productData.categoría}`,
          price: parseFloat(productData.precio),
          stock: 10, // Stock por defecto
          category: productData.categoría,
          image: productData.imagen
        };

        // Verificar si el producto ya existe
        const existingProduct = await prisma.product.findUnique({
          where: { name: mappedProduct.name }
        });

        if (existingProduct) {
          // Actualizar producto existente
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              description: mappedProduct.description,
              price: mappedProduct.price,
              stock: mappedProduct.stock,
              category: mappedProduct.category,
              image: mappedProduct.image
            }
          });
          updated++;
          console.log(`🔄 Actualizado: ${mappedProduct.name}`);
        } else {
          // Crear nuevo producto
          await prisma.product.create({
            data: mappedProduct
          });
          imported++;
          console.log(`✅ Creado: ${mappedProduct.name} - $${mappedProduct.price.toLocaleString('es-AR')}`);
        }

      } catch (error) {
        console.log(`❌ Error con "${productData.nombre}": ${error.message}`);
        errors.push(`Error con "${productData.nombre}": ${error.message}`);
      }
    }

    console.log('\n📈 RESUMEN DE IMPORTACIÓN:');
    console.log(`✅ Productos creados: ${imported}`);
    console.log(`🔄 Productos actualizados: ${updated}`);
    console.log(`❌ Errores: ${errors.length}`);

    if (errors.length > 0) {
      console.log('\n📋 Detalles de errores:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }

    // Cerrar conexión de Prisma
    await prisma.$disconnect();

  } catch (error) {
    console.log('❌ ERROR GENERAL:', error.message);
  }
}

// Ejecutar la importación
importProductsDirectly(); 