# 📧 Configuración de Notificaciones por Email - IT360

## 🎯 **Resumen del Sistema**

Ahora tienes **notificaciones por email automáticas** para todas las consultas y solicitudes:

### 📧 **Tipos de Notificaciones**
1. **Presupuestos** → Email con detalles completos del cliente y servicio
2. **Contactos** → Email con consultas generales, vendedor, hogar inteligente
3. **Ventas** → Email con solicitudes de compra y método de pago

### 🔗 **Dónde van las Consultas**
- **📧 Contactos** → `/admin/contacts` (consultas generales, vendedor, hogar)
- **🎫 Presupuestos** → `/admin/presupuestos` (solicitudes de presupuesto)
- **💳 Ventas** → `/admin/transferencias` (habilitar pagos)

---

## ⚙️ **Configuración de Gmail**

### 1. **Activar Verificación en 2 Pasos**
1. Ve a tu cuenta de Gmail
2. Activa la verificación en 2 pasos
3. Ve a "Contraseñas de aplicación"
4. Genera una contraseña para "IT360 Sistema"

### 2. **Configurar Variables de Entorno**
Edita el archivo `.env` y reemplaza:
```env
GMAIL_USER=tu-email@gmail.com
GMAIL_PASS=tu-contraseña-de-aplicacion
GMAIL_FROM=tu-email@gmail.com
GMAIL_TO=tu-email@gmail.com
```

### 3. **Probar Configuración**
```bash
npm run test-email
```

---

## 🚀 **Comandos Útiles**

### **Ver Todas las Consultas**
```bash
npm run show-consultas
```

### **Probar Notificaciones por Email**
```bash
npm run test-email
```

### **Ver Datos de Contacto**
```bash
npm run show-contacts
```

### **Ver Todos los Datos**
```bash
npm run show-all-data
```

---

## 📋 **Flujo Completo**

### **1. Cliente envía formulario**
- Se guarda en la base de datos
- Se envía email automático a tu Gmail
- Puedes responder directamente desde Gmail

### **2. Panel de Administración**
- **Contactos**: `/admin/contacts`
- **Presupuestos**: `/admin/presupuestos`
- **Transferencias**: `/admin/transferencias`

### **3. Respuesta al Cliente**
- Responde directamente desde Gmail
- O usa el panel de administración
- Sistema de tickets para seguimiento

---

## 💡 **Ventajas del Sistema**

✅ **Notificaciones inmediatas** en tu email
✅ **Respuesta directa** desde Gmail
✅ **Panel de administración** completo
✅ **Seguimiento de tickets** organizado
✅ **Configuración simple** con Gmail
✅ **Gratis** hasta 500 emails/día

---

## 🔧 **Solución de Problemas**

### **Error de Autenticación**
- Verifica que uses contraseña de aplicación
- Asegúrate de tener verificación en 2 pasos activada
- Revisa que GMAIL_USER y GMAIL_PASS estén correctos

### **No llegan los emails**
- Revisa la carpeta de spam
- Verifica la configuración en `.env`
- Ejecuta `npm run test-email` para probar

### **Límite de emails**
- Gmail: 500 emails/día (gratis)
- Para más volumen: usar Resend o SendGrid

---

## 📞 **Soporte**

Si tienes problemas:
1. Ejecuta `npm run test-email` para diagnosticar
2. Verifica la configuración en `.env`
3. Revisa los logs del servidor

¡El sistema está listo para recibir y gestionar todas las consultas automáticamente! 🎉 