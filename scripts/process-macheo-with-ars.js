/**
 * Procesa macheo_productos_top3.csv y agrega columna PrecioARS
 * para que sea compatible con el script de importación con markup
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

// Configuración
const INPUT_CSV = "macheo_productos_top3.csv";
const OUTPUT_CSV = "macheo_productos_top3_processed.csv";
const PRECIO_ARS = 1345; // Precio en pesos argentinos que especificaste

async function processCSV() {
  console.log("🔄 Procesando archivo CSV...");
  console.log(`📁 Archivo de entrada: ${INPUT_CSV}`);
  console.log(`💰 Precio ARS a aplicar: $${PRECIO_ARS.toLocaleString("es-AR")}`);

  try {
    // Leer el archivo CSV original
    const raw = fs.readFileSync(INPUT_CSV, "utf8");
    const rows = parse(raw, { columns: true, skip_empty_lines: true });

    console.log(`📊 Total de filas encontradas: ${rows.length}`);

    // Procesar cada fila y agregar la columna PrecioARS
    const processedRows = rows.map((row, index) => {
      // Crear nueva fila con la estructura esperada por el script de importación
      return {
        Producto_JS: row.Producto_JS || "",
        Match_Excel: row.Match_Excel || "",
        Marca: row.Marca || "",
        PrecioUSD: row.PrecioUSD || 0,
        Similaridad: row.Similaridad || 0,
        PrecioARS: PRECIO_ARS // Agregar el precio en pesos argentinos
      };
    });

    // Convertir a CSV con la nueva estructura
    const csvOutput = stringify(processedRows, {
      header: true,
      columns: ["Producto_JS", "Match_Excel", "Marca", "PrecioUSD", "Similaridad", "PrecioARS"]
    });

    // Guardar el archivo procesado
    fs.writeFileSync(OUTPUT_CSV, csvOutput, "utf8");

    console.log(`✅ Archivo procesado guardado como: ${OUTPUT_CSV}`);
    console.log(`📈 Filas procesadas: ${processedRows.length}`);

    // Mostrar algunas filas de ejemplo
    console.log("\n📋 Ejemplos de filas procesadas:");
    processedRows.slice(0, 5).forEach((row, index) => {
      console.log(`${index + 1}. ${row.Producto_JS} → $${row.PrecioARS.toLocaleString("es-AR")}`);
    });

    console.log("\n🚀 Ahora puedes ejecutar el script de importación:");
    console.log(`CSV_PATH=${OUTPUT_CSV} node scripts/import-from-macheo-tiered.js`);

  } catch (error) {
    console.error("❌ Error procesando el archivo:", error.message);
  }
}

// Ejecutar el procesamiento
processCSV();
