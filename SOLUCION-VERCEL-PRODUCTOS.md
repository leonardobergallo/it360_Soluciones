# 🔧 Solución: Productos no se muestran en Vercel

## 🚨 Problema identificado
Los productos no se muestran cuando subes la aplicación a Vercel porque:
1. **Variables de entorno no configuradas** en Vercel
2. **Base de datos Neon** no accesible desde Vercel
3. **Productos vacíos** o no marcados como activos

## ✅ Solución paso a paso

### Paso 1: Configurar variables de entorno en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Ve a Settings > Environment Variables**
3. **Agrega las siguientes variables** (copia del archivo `vercel-env.txt`):

```
DATABASE_URL=postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8q8x.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require
NEXTAUTH_SECRET=tu-secret-aqui
NEXTAUTH_URL=https://tu-dominio-vercel.vercel.app
RESEND_API_KEY=re_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k
IT360_EMAIL=it360tecnologia@gmail.com
GMAIL_USER=it360tecnologia@gmail.com
GMAIL_PASS=tu-password-de-gmail
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244
MERCADOPAGO_PUBLIC_KEY=APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753
MERCADOPAGO_CLIENT_ID=4993379468155901
MERCADOPAGO_CLIENT_SECRET=Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS
NODE_ENV=production
```

⚠️ **IMPORTANTE**: Cambia `NEXTAUTH_URL` por tu dominio real de Vercel (ej: `https://tu-app.vercel.app`)

### Paso 2: Verificar base de datos Neon

1. **Ve a Neon Dashboard** (https://console.neon.tech)
2. **Verifica que tu base de datos esté activa**
3. **Verifica las credenciales** en la conexión

### Paso 3: Crear productos de prueba

**Opción A: Usar el script local (si tienes acceso a Neon)**
```bash
npm run check-neon
```

**Opción B: Crear productos manualmente**
1. Ve a tu aplicación en Vercel
2. Inicia sesión como admin
3. Ve a `/admin/products`
4. Crea algunos productos de prueba

### Paso 4: Redeploy en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Haz clic en "Redeploy"**
3. **Espera a que termine el build**

### Paso 5: Verificar que funcione

1. **Ve a tu aplicación en Vercel**
2. **Navega a `/catalogo`**
3. **Verifica que los productos se muestren**

## 🔍 Diagnóstico

### Si los productos siguen sin aparecer:

1. **Verifica los logs de Vercel**:
   - Ve a tu proyecto en Vercel Dashboard
   - Ve a "Functions" y revisa los logs de `/api/products`

2. **Verifica la base de datos**:
   - Ejecuta: `npm run verify-vercel`
   - Revisa si hay errores de conexión

3. **Verifica el build**:
   - Ejecuta localmente: `npm run build`
   - Revisa si hay errores de Prisma

## 🛠️ Comandos útiles

```bash
# Verificar configuración
npm run verify-vercel

# Crear productos de prueba
npm run check-neon

# Generar Prisma Client
npx prisma generate

# Build local
npm run build
```

## 📋 Checklist

- [ ] Variables de entorno configuradas en Vercel
- [ ] NEXTAUTH_URL actualizado con tu dominio real
- [ ] Base de datos Neon activa
- [ ] Productos creados en la base de datos
- [ ] Productos marcados como `active: true`
- [ ] Redeploy realizado en Vercel
- [ ] Logs verificados sin errores

## 🆘 Si el problema persiste

1. **Revisa los logs de Vercel** para errores específicos
2. **Verifica que Prisma Client se genere** durante el build
3. **Asegúrate de que la base de datos tenga el esquema correcto**
4. **Verifica que las credenciales de Neon sean correctas**

## 📞 Contacto

Si necesitas ayuda adicional, revisa:
- Logs de Vercel en el dashboard
- Logs de la API en `/api/products`
- Estado de la base de datos Neon
