# Configuración de IT360 Soluciones

## Configuración Automática

El sistema ahora usa una configuración centralizada que se ajusta automáticamente según el entorno (desarrollo/producción).

### Archivos de Configuración

1. **`lib/config.ts`** - Configuración centralizada
2. **`config-template.env`** - Plantilla de variables de entorno
3. **`lib/prisma.ts`** - Configuración de base de datos automática

### Variables de Entorno

#### Para Desarrollo Local
```bash
# Copia el archivo de plantilla
cp config-template.env .env

# Ajusta NODE_ENV para desarrollo
NODE_ENV=development
```

#### Para Vercel (Producción)
```bash
# Usa las mismas variables pero con NODE_ENV=production
NODE_ENV=production
```

### Configuración Automática

El sistema automáticamente:

1. **Base de datos**: 
   - Desarrollo: Usa conexión directa a Neon
   - Producción: Usa pooler de Neon para Vercel

2. **URLs**:
   - Desarrollo: `http://localhost:3000`
   - Producción: URL de Vercel

3. **Variables**: Se cargan desde `process.env` con valores por defecto

### Variables Requeridas

```bash
# Base de datos
DATABASE_URL=postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8q8x-pooler.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require

# Autenticación
NEXTAUTH_SECRET=it360-secret-key-2024-secure
NEXTAUTH_URL=https://it360-soluciones-git-main-leonardobergallos-projects.vercel.app

# Email
RESEND_API_KEY=re_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k
IT360_EMAIL=it360tecnologia@gmail.com

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244
MERCADOPAGO_PUBLIC_KEY=APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753
MERCADOPAGO_CLIENT_ID=4993379468155901
MERCADOPAGO_CLIENT_SECRET=Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS

# Entorno
NODE_ENV=production
```

### Ventajas de esta Configuración

✅ **No cambia**: Las variables son las mismas en todos los entornos
✅ **Automática**: Se ajusta según NODE_ENV
✅ **Centralizada**: Todo en un solo lugar
✅ **Fácil mantenimiento**: Un solo archivo de configuración
✅ **Segura**: Valores por defecto incluidos

### Uso en el Código

```typescript
import { config } from '@/lib/config';

// Usar configuración
const dbUrl = config.database.url;
const authSecret = config.auth.secret;
const mpToken = config.mercadopago.accessToken;
```
