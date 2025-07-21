// Datos de monitores para importar
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

// Función para ejecutar la importación
async function executeImport() {
  console.log('🚀 EJECUTANDO IMPORTACIÓN DE MONITORES');
  console.log('=====================================\n');

  try {
    // Hacer la petición HTTP a la API de importación
    const response = await fetch('http://localhost:3000/api/admin/import-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer admin-token' // Token temporal para testing
      },
      body: JSON.stringify({
        products: monitorProducts
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ IMPORTACIÓN EXITOSA');
      console.log(`📦 Productos importados: ${result.imported}`);
      console.log(`❌ Errores: ${result.errors}`);
      console.log(`💬 Mensaje: ${result.message}`);
      
      if (result.errorDetails && result.errorDetails.length > 0) {
        console.log('\n📋 Detalles de errores:');
        result.errorDetails.forEach((error, index) => {
          console.log(`${index + 1}. ${error}`);
        });
      }
    } else {
      console.log('❌ ERROR EN LA IMPORTACIÓN');
      console.log(`Error: ${result.error}`);
    }

  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN');
    console.log(`Asegúrate de que el servidor esté corriendo en http://localhost:3000`);
    console.log(`Error: ${error.message}`);
  }
}

// Ejecutar la importación
executeImport(); 