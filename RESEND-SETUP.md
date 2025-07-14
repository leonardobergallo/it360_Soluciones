# Configuración de Resend para Envío de Emails

## 🚀 Configuración Rápida

### 1. Crear cuenta en Resend
- Ve a [resend.com](https://resend.com)
- Crea una cuenta gratuita
- Verifica tu dominio (it360.com.ar) o usa el dominio de prueba

### 2. Obtener API Key
- En el dashboard de Resend, ve a "API Keys"
- Crea una nueva API key
- Copia la key (empieza con `re_`)

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Resend para envío de emails
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Otras variables existentes
DATABASE_URL="tu_url_de_base_de_datos"
JWT_SECRET="tu_jwt_secret"
```

### 4. Verificar dominio (opcional)
Para usar `noreply@it360.com.ar` como remitente:
- Agrega tu dominio en Resend
- Configura los registros DNS
- Verifica el dominio

## 📧 Funcionalidades Implementadas

### Endpoint: `/api/contacto-hogar`
- **POST**: Recibe consultas del formulario de Hogar Inteligente
- **GET**: Lista consultas (para administradores)
- **Email automático**: Envía email a info@it360.com.ar
- **Base de datos**: Guarda como presupuesto

### Formulario en `/hogar-inteligente`
- Campos: nombre, email, teléfono, tipo de consulta, mensaje
- Validación en tiempo real
- Estados de carga y feedback
- Limpieza automática después del envío

## 🎨 Template de Email

El email incluye:
- Header con logo y branding de IT360
- Detalles completos de la consulta
- Fecha y hora en zona horaria argentina
- Diseño responsive y profesional
- Reply-to configurado al email del cliente

## 🔧 Personalización

### Cambiar email de destino
En `app/api/contacto-hogar/route.ts`, línea 95:
```typescript
to: ['tu-email@dominio.com'],
```

### Cambiar remitente
En `app/api/contacto-hogar/route.ts`, línea 94:
```typescript
from: 'Tu Empresa <noreply@tudominio.com>',
```

### Personalizar template
Modifica la variable `htmlContent` en la función `enviarEmailConsulta`.

## 🚨 Solución de Problemas

### Error: "RESEND_API_KEY no configurada"
- Verifica que el archivo `.env.local` existe
- Confirma que la variable `RESEND_API_KEY` está definida
- Reinicia el servidor de desarrollo

### Error: "Domain not verified"
- Usa el dominio de prueba de Resend temporalmente
- O verifica tu dominio en el dashboard de Resend

### Emails no llegan
- Revisa la carpeta de spam
- Verifica los logs en la consola del servidor
- Confirma que la API key es válida

## 📊 Monitoreo

### Logs en consola
El servidor muestra:
- ✅ Email enviado exitosamente
- ❌ Error al enviar email (con detalles)
- 📋 Contenido del email (si no hay API key)

### Base de datos
Todas las consultas se guardan en la tabla `Presupuesto` con:
- `servicio: "Hogar Inteligente"`
- `estado: "pendiente"`
- Timestamp de creación

## 🔒 Seguridad

- La API key está en variables de entorno
- Validación de campos en frontend y backend
- Manejo de errores sin exponer información sensible
- Rate limiting recomendado para producción 