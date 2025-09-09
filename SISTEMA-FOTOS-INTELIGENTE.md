# 🎯 Sistema de Fotos Inteligente

## 📋 Descripción

Sistema que asigna **fotos únicas solo a productos que coincidan exactamente** con imágenes disponibles, y para el resto muestra **solo el nombre del producto** sin foto genérica.

## 🎯 Características

### ✅ **Fotos Específicas**
- Solo asigna fotos a productos con coincidencia ≥80%
- Busca coincidencias exactas por nombre
- Usa algoritmo de similitud inteligente

### 📝 **Solo Nombre**
- Productos sin foto específica muestran `USE_NAME`
- Diseño atractivo con gradiente
- Categoría visible como badge

## 🚀 Scripts Creados

### 1. **`smart-photo-assignment.js`**
Asigna fotos inteligentemente a productos existentes.

```bash
node scripts/smart-photo-assignment.js
```

### 2. **`complete-macheo-with-photos.js`**
Proceso completo: macheo + fotos inteligentes.

```bash
node scripts/complete-macheo-with-photos.js
```

### 3. **`configure-name-display.js`**
Configura el frontend para mostrar nombres.

```bash
node scripts/configure-name-display.js
```

### 4. **`test-photo-system.js`**
Prueba el sistema antes de implementar.

```bash
node scripts/test-photo-system.js
```

## 📊 Proceso Completo

### **Paso 1: Probar el Sistema**
```bash
node scripts/test-photo-system.js
```

### **Paso 2: Ejecutar Macheo Completo**
```bash
# Asegúrate de tener el archivo de macheo
CSV_PATH=macheo_productos_top3_processed.csv node scripts/complete-macheo-with-photos.js
```

### **Paso 3: Configurar Frontend**
```bash
node scripts/configure-name-display.js
```

## 🎨 Configuración del Frontend

### **CSS Generado**
```css
.product-name-only {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### **Componente React**
```tsx
export function ProductCard({ product }: ProductCardProps) {
  const isNameOnly = product.image === 'USE_NAME';
  
  return (
    <div className="product-card">
      {isNameOnly ? (
        <div className="product-name-only">
          <div className="category-badge">{product.category}</div>
          <h3>{product.name}</h3>
        </div>
      ) : (
        <img src={product.image} alt={product.name} />
      )}
    </div>
  );
}
```

## ⚙️ Configuración

### **Variables de Entorno**
```bash
# Archivo CSV del macheo
CSV_PATH=macheo_productos_top3_processed.csv

# Similitud mínima para asignar foto (0.8 = 80%)
MIN_SIMILARITY_SCORE=0.8

# Imagen por defecto (no se usa en este sistema)
DEFAULT_IMAGE=/icono.png
```

### **Parámetros Ajustables**
- **`MIN_SIMILARITY_SCORE`**: Similitud mínima para asignar foto (0.8 = 80%)
- **`TIERS`**: Tramos de markup por precio
- **Estilos CSS**: Personalizables en `config/name-display.css`

## 📊 Resultados Esperados

### **Estadísticas Típicas**
- **📸 Productos con foto específica**: 20-40%
- **📝 Productos solo con nombre**: 60-80%
- **🎯 Precisión de coincidencias**: >95%

### **Ejemplos de Coincidencias**
- `iPhone 15 Pro` → `/images/iphone-15-pro.jpg` ✅
- `Samsung Galaxy S24` → `/images/samsung-galaxy-s24.jpg` ✅
- `Cable USB genérico` → `USE_NAME` 📝
- `Producto sin imagen específica` → `USE_NAME` 📝

## 🔧 Mantenimiento

### **Agregar Nuevas Imágenes**
1. Subir imagen a `/public/images/`
2. Nombre debe coincidir con el producto
3. Ejecutar `smart-photo-assignment.js` para reasignar

### **Ajustar Similitud**
1. Modificar `MIN_SIMILARITY_SCORE` en los scripts
2. Probar con `test-photo-system.js`
3. Re-ejecutar asignación si es necesario

### **Verificar Resultados**
```bash
# Ver estadísticas
node scripts/test-photo-system.js

# Ver productos con fotos
node scripts/check-images.js
```

## 🎯 Ventajas del Sistema

### ✅ **Precisión**
- Solo fotos que realmente corresponden
- No fotos genéricas incorrectas
- Coincidencias exactas

### ✅ **Rendimiento**
- Menos imágenes que cargar
- Carga más rápida
- Mejor experiencia de usuario

### ✅ **Mantenibilidad**
- Fácil de actualizar
- Sistema escalable
- Configuración flexible

## 🚨 Solución de Problemas

### **Problema: Pocas coincidencias**
```bash
# Reducir similitud mínima
MIN_SIMILARITY_SCORE=0.6 node scripts/complete-macheo-with-photos.js
```

### **Problema: Demasiadas coincidencias incorrectas**
```bash
# Aumentar similitud mínima
MIN_SIMILARITY_SCORE=0.9 node scripts/complete-macheo-with-photos.js
```

### **Problema: Imágenes no se muestran**
```bash
# Verificar rutas
node scripts/find-broken-images.js
```

## 📝 Notas Importantes

1. **Backup**: Siempre hacer backup antes de ejecutar
2. **Pruebas**: Usar `test-photo-system.js` primero
3. **Configuración**: Ajustar parámetros según necesidades
4. **Frontend**: Implementar los componentes generados

## 🎉 Resultado Final

- **Productos con fotos específicas**: Muestran su foto real
- **Productos sin foto específica**: Muestran nombre atractivo
- **Sistema escalable**: Fácil de mantener y actualizar
- **Experiencia de usuario**: Mejor que fotos genéricas incorrectas
