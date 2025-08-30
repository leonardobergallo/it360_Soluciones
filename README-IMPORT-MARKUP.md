# 📦 Script de Importación con Markup por Tramos

## 🎯 Descripción

Este script importa productos desde un archivo CSV aplicando **markup por tramos de costo** en pesos argentinos y los guarda en la base de datos Prisma.

## 🚀 Características

- **Markup automático por tramos** según el precio base
- **Categorización automática** basada en palabras clave
- **Redondeo configurable** de precios finales
- **Upsert inteligente** (crear o actualizar)
- **Logging detallado** del proceso

## 📊 Tramos de Markup

| Rango de Precio (ARS) | Markup Aplicado |
|----------------------|-----------------|
| $0 - $30,000         | +80%            |
| $30,000 - $80,000    | +65%            |
| $80,000 - $150,000   | +60%            |
| $150,000 - $300,000  | +55%            |
| $300,000 - $700,000  | +50%            |
| $700,000 - $1,200,000| +40%            |
| $1,200,000+          | +35%            |

## 📋 Requisitos

```bash
npm install csv-parse
npm install @prisma/client
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Archivo CSV a importar
CSV_PATH=macheo_productos_top3_ARS.csv

# Redondeo de precios (none, 100, 1000)
ROUNDING=100

# Stock por defecto
DEFAULT_STOCK=10

# Imagen por defecto
DEFAULT_IMAGE=/icono.png

# Productos activos por defecto
DEFAULT_ACTIVE=true
```

### Estructura del CSV

El archivo CSV debe tener las siguientes columnas:

```csv
Producto_JS,Match_Excel,Marca,PrecioUSD,Similaridad,PrecioARS
"Nombre del Producto","Descripción del producto","Marca",999,0.95,850000
```

- **Producto_JS**: Nombre del producto (obligatorio)
- **Match_Excel**: Descripción del producto
- **Marca**: Marca del producto
- **PrecioUSD**: Precio en dólares (opcional)
- **Similaridad**: Puntuación de similitud (opcional)
- **PrecioARS**: Precio base en pesos argentinos (obligatorio)

## 🎮 Uso

### 1. Preparar el archivo CSV

Asegúrate de que tu archivo CSV tenga la estructura correcta:

```csv
Producto_JS,Match_Excel,Marca,PrecioUSD,Similaridad,PrecioARS
"iPhone 15 Pro 128GB","iPhone 15 Pro 128GB Titanio Natural",Apple,999,0.98,850000
"Monitor LG 27GP750-B","Monitor Gaming LG 27 pulgadas",LG,1200,0.95,507500
```

### 2. Ejecutar el script

```bash
# Uso básico
node scripts/import-from-macheo-tiered.js

# Con variables de entorno personalizadas
CSV_PATH=mi_archivo.csv ROUNDING=1000 node scripts/import-from-macheo-tiered.js
```

### 3. Verificar resultados

El script mostrará:
- Productos creados (🆕)
- Productos actualizados (🔄)
- Errores encontrados (❌)
- Resumen final

## 📁 Ejemplo de Salida

```
🚀 Importando desde: /ruta/al/archivo/macheo_productos_top3_ARS.csv

🆕 Creado: iPhone 15 Pro 128GB → $1,275,000
🆕 Creado: Monitor LG 27GP750-B → $761,250
🔄 Actualizado: Samsung Galaxy S24 → $1,680,000

📊 Resumen
✅ Creados: 15
🔄 Actualizados: 5
⚠️ Errores: 0
```

## 🎨 Categorización Automática

El script categoriza automáticamente los productos basándose en palabras clave:

| Palabras Clave | Categoría |
|----------------|-----------|
| monitor | Monitores |
| impresora, printer | Impresora |
| parlante, speaker | Parlantes |
| auricular, airpods | Accesorio |
| tablet, ipad | Tablets |
| iphone, samsung galaxy, celular | Celulares |
| ssd, hdd, disco | Almacena |
| teclado, mouse, logitech | Periferico |
| router, switch, wifi | Redes |
| cafetera, exprimidor | Cocina |
| silla, escritorio | Muebles |

## ⚙️ Personalización

### Modificar Tramos de Markup

Edita el array `TIERS` en el script:

```javascript
const TIERS = [
  { max:  30000,   pct: 0.80 },  // 0-30k → +80%
  { max:  80000,   pct: 0.65 },  // 30k-80k → +65%
  { max: 150000,   pct: 0.60 },  // 80k-150k → +60%
  // ... agregar más tramos
];
```

### Modificar Categorización

Edita la función `inferCategory()`:

```javascript
function inferCategory(text) {
  const t = (text || "").toLowerCase();
  if (t.includes("tu_palabra_clave")) return "Tu_Categoria";
  // ... más reglas
  return "Otros";
}
```

### Cambiar Redondeo

```bash
# Sin redondeo (2 decimales)
ROUNDING=none node scripts/import-from-macheo-tiered.js

# Múltiplos de $100
ROUNDING=100 node scripts/import-from-macheo-tiered.js

# Múltiplos de $1000
ROUNDING=1000 node scripts/import-from-macheo-tiered.js
```

## 🔍 Troubleshooting

### Error: "Cannot find module 'csv-parse'"
```bash
npm install csv-parse
```

### Error: "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npx prisma generate
```

### Error: "CSV file not found"
Verifica que el archivo CSV existe en la ruta especificada:
```bash
ls -la macheo_productos_top3_ARS.csv
```

### Error: "Database connection failed"
Verifica tu configuración de Prisma:
```bash
npx prisma db push
npx prisma generate
```

## 📈 Ejemplos de Cálculo

### Producto de $50,000 ARS
- **Tramo**: $30,000 - $80,000 → +65%
- **Precio final**: $50,000 × 1.65 = $82,500
- **Redondeado a $100**: $82,500

### Producto de $1,500,000 ARS
- **Tramo**: $1,200,000+ → +35%
- **Precio final**: $1,500,000 × 1.35 = $2,025,000
- **Redondeado a $1000**: $2,025,000

## 🚀 Próximos Pasos

1. **Personalizar categorías** según tu taxonomía
2. **Ajustar tramos de markup** según tu estrategia de precios
3. **Agregar validaciones** adicionales si es necesario
4. **Integrar con otros scripts** de importación

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs de error
2. Verifica la estructura del CSV
3. Confirma la configuración de Prisma
4. Revisa las variables de entorno
