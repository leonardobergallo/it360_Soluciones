# Funcionalidad de Contacto con Vendedor

## 📋 Descripción

Esta funcionalidad permite a los usuarios contactar directamente con el vendedor cuando están interesados en un producto específico. Incluye:

- **Modal de contacto** con formulario completo
- **Integración con WhatsApp** para contacto directo
- **Envío de emails** de confirmación al cliente y notificación al administrador
- **Almacenamiento en base de datos** de todas las consultas

## 🚀 Características

### ✅ Funcionalidades Implementadas

1. **Modal de Contacto**
   - Formulario con campos: nombre, email, teléfono, mensaje
   - Información del producto seleccionado
   - Validación de campos requeridos
   - Estados de carga y éxito/error

2. **Integración WhatsApp**
   - Botón directo para abrir WhatsApp
   - Mensaje pre-llenado con información del producto
   - Número configurado: +54 9 342 5089906

3. **Sistema de Emails**
   - **Email al cliente**: Confirmación de consulta recibida
   - **Email al administrador**: Notificación de nueva consulta
   - Plantillas HTML profesionales
   - Configuración con Resend

4. **Base de Datos**
   - Almacenamiento en tabla `presupuesto`
   - Estado "pendiente" por defecto
   - Información completa de la consulta

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
- `app/api/contacto-vendedor/route.ts` - API para procesar contactos
- `components/ContactVendorModal.tsx` - Componente modal de contacto
- `components/ProductSelector.tsx` - Componente para seleccionar múltiples productos
- `scripts/test-contact-vendor.js` - Script de prueba para catálogo
- `scripts/test-homepage-contact.js` - Script de prueba para página principal

### Archivos Modificados
- `app/catalogo/page.tsx` - Integración del modal
- `app/page.tsx` - Integración del modal con botones adicionales

## 🔧 Configuración Requerida

### Variables de Entorno
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Email del Administrador
En `app/api/contacto-vendedor/route.ts`, línea 189:
```typescript
to: ['leonardobergallo@gmail.com'], // Email del administrador
```

## 🎯 Cómo Funciona

### 1. Flujo del Usuario

#### En Catálogo (`/catalogo`):
1. Usuario ve un producto en el catálogo
2. Hace clic en "Ver Detalles" para abrir el modal
3. En el modal, hace clic en "Contactar Vendedor"
4. Se abre el modal de contacto con información del producto

#### En Página Principal (`/`):
1. Usuario ve productos en la sección de productos
2. Puede hacer clic en:
   - **"Ver"**: Para ver detalles del producto
   - **"Contactar"**: Para contactar directamente
3. También puede hacer clic en "Contactar Vendedor" desde el modal de detalles

#### En Ambos Casos:
4. Puede:
   - **Opción A**: Hacer clic en "Contactar por WhatsApp" (contacto directo)
   - **Opción B**: Completar el formulario y enviar

#### Selección Múltiple:
5. **Nueva funcionalidad**: Seleccionar múltiples productos antes de contactar
6. **Resumen automático**: Lista de productos y precio total
7. **Email personalizado**: Incluye todos los productos seleccionados

### 2. Procesamiento del Formulario
1. Validación de campos requeridos
2. Creación de registro en base de datos
3. Envío de email de confirmación al cliente
4. Envío de email de notificación al administrador
5. Generación de URL de WhatsApp
6. Respuesta de éxito al frontend

### 3. Emails Enviados

#### Email al Cliente
- **Asunto**: "Consulta recibida - IT360 Soluciones"
- **Contenido**: Confirmación de consulta, información del producto(s), precio total
- **Incluye**: Enlace a WhatsApp para contacto directo
- **Sin mostrar email del administrador** en el mensaje de éxito

#### Email al Administrador
- **Asunto**: "Nueva consulta de [Nombre] - [Producto(s)]"
- **Contenido**: Detalles completos de la consulta con lista de productos
- **Destinatario**: leonardobergallo@gmail.com
- **Incluye**: Botones para contactar por WhatsApp o email

## 🧪 Pruebas

### Script de Prueba
```bash
node scripts/test-contact-vendor.js
```

### Prueba Manual

#### Catálogo:
1. Ir al catálogo: `http://localhost:3000/catalogo`
2. Hacer clic en cualquier producto
3. Hacer clic en "Contactar Vendedor"
4. Completar el formulario o usar WhatsApp directo

#### Página Principal:
1. Ir a la página principal: `http://localhost:3000`
2. Bajar a la sección "Productos"
3. Hacer clic en "Contactar" en cualquier producto
4. O hacer clic en "Ver" y luego "Contactar Vendedor"
5. Completar el formulario o usar WhatsApp directo

## 📱 Integración WhatsApp

### URL Generada
```
https://wa.me/5493425089906?text=¡Hola! Soy [Nombre] y me interesa el producto: [Producto]
Precio: $[Precio]

Mi consulta: [Mensaje]

¿Podrían ayudarme con más información?
```

### Número Configurado
- **País**: Argentina (+54)
- **Código de área**: 342 (Santa Fe)
- **Número**: 5089906

## 🎨 Características del UI

### Modal de Contacto
- **Diseño**: Moderno con gradientes y efectos de blur
- **Responsive**: Adaptado para móviles y desktop
- **Accesibilidad**: Labels, focus states, keyboard navigation
- **Estados**: Loading, success, error

### Botones
- **WhatsApp**: Verde con icono de WhatsApp
- **Enviar**: Azul con gradiente y efectos hover
- **Cerrar**: X en la esquina superior derecha

## 🔒 Seguridad

### Validaciones
- Campos requeridos: nombre, email, mensaje
- Formato de email válido
- Sanitización de datos antes de guardar

### Manejo de Errores
- Try-catch en todas las operaciones
- Logs detallados para debugging
- Mensajes de error amigables al usuario

## 📊 Base de Datos

### Tabla `presupuesto`
```sql
CREATE TABLE presupuesto (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  empresa TEXT,
  servicio TEXT NOT NULL,
  mensaje TEXT,
  estado TEXT DEFAULT 'pendiente',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Campos Utilizados
- `nombre`: Nombre del cliente
- `email`: Email del cliente
- `telefono`: Teléfono (opcional)
- `empresa`: Tipo de consulta
- `servicio`: Nombre del producto
- `mensaje`: Consulta del cliente
- `estado`: "pendiente" por defecto

## 🚀 Despliegue

### Verificar Configuración
1. Variable `RESEND_API_KEY` configurada
2. Email del administrador actualizado
3. Base de datos conectada
4. Pruebas ejecutadas exitosamente

### Monitoreo
- Revisar logs de emails enviados
- Verificar registros en base de datos
- Monitorear consultas de WhatsApp

## 🔄 Mejoras Futuras

### Posibles Extensiones
1. **Notificaciones push** para consultas urgentes
2. **Chat en vivo** integrado
3. **Seguimiento de estado** de consultas
4. **Analytics** de consultas por producto
5. **Respuestas automáticas** basadas en categorías

### Optimizaciones
1. **Cache** de productos frecuentes
2. **Rate limiting** para prevenir spam
3. **Validación avanzada** de teléfonos
4. **Integración CRM** para seguimiento

## 📞 Soporte

Para problemas o consultas sobre esta funcionalidad:
- Revisar logs del servidor
- Verificar configuración de Resend
- Probar con el script de prueba
- Contactar al equipo de desarrollo 