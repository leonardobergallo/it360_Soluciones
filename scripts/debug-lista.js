/**
 * Script para debuggear el archivo lista (1).xls
 */

const XLSX = require('xlsx');

// Leer archivo XLS
const workbook = XLSX.readFile('lista (1).xls');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('📊 PRIMERAS 10 FILAS DEL ARCHIVO:');
console.log('=' .repeat(60));

for (let i = 0; i < Math.min(10, data.length); i++) {
  const row = data[i];
  console.log(`\nFila ${i + 1}:`);
  console.log('Campos disponibles:', Object.keys(row));
  
  // Mostrar algunos campos clave
  console.log('Cd.:', row['Cd.']);
  console.log('Descripcin:', row['Descripcin']);
  console.log('Rubro:', row['Rubro']);
  console.log('Marca:', row['Marca']);
  console.log('Precios con IVA (DOLAR (U$S)):', row['Precios con IVA (DOLAR (U$S))']);
  console.log('Stock:', row['Stock']);
}

console.log(`\n📈 Total de filas: ${data.length}`);

// Buscar filas con precios válidos
console.log('\n🔍 BUSCANDO FILAS CON PRECIOS VÁLIDOS:');
let validRows = 0;
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  const precioUSD = parseFloat(row['Precios con IVA (DOLAR (U$S))']);
  const descripcion = row['Descripcin'];
  
  if (descripcion && precioUSD && precioUSD > 0) {
    validRows++;
    if (validRows <= 5) { // Mostrar solo las primeras 5
      console.log(`\nFila ${i + 1} - VÁLIDA:`);
      console.log(`  Descripción: ${descripcion}`);
      console.log(`  Precio USD: $${precioUSD}`);
      console.log(`  Rubro: ${row['Rubro']}`);
      console.log(`  Marca: ${row['Marca']}`);
    }
  }
}

console.log(`\n✅ Filas con datos válidos: ${validRows} de ${data.length}`);
