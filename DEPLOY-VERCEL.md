# 🚀 Guía de Despliegue en Vercel - IT360 Soluciones

## 📋 Requisitos Previos

1. **Cuenta en Vercel**: [vercel.com](https://vercel.com)
2. **Base de datos PostgreSQL**: Recomendamos Neon, Supabase o Railway
3. **Repositorio en GitHub**: Código subido a GitHub

## 🔧 Configuración de Base de Datos

### Opción 1: Neon (Recomendado)
1. Ve a [neon.tech](https://neon.tech)
2. Crea una cuenta y un nuevo proyecto
3. Copia la URL de conexión PostgreSQL
4. Ejecuta las migraciones:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   npx prisma db seed
   ```

### Opción 2: Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un proyecto
3. Ve a Settings > Database
4. Copia la connection string

### Opción 3: Railway
1. Ve a [railway.app](https://railway.app)
2. Crea un proyecto PostgreSQL
3. Copia la URL de conexión

## 🚀 Despliegue en Vercel

### Paso 1: Conectar Repositorio
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `it360_Soluciones`

### Paso 2: Configurar Variables de Entorno
En Vercel, ve a Settings > Environment Variables y agrega:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@host:puerto/database?sslmode=require"

# JWT Secret (genera uno seguro)
JWT_SECRET="tu-jwt-secret-super-seguro-aqui-cambiar-en-produccion"

# Environment
NODE_ENV="production"

# NextAuth.js
NEXTAUTH_SECRET="tu-secret-aqui-cambiar-en-produccion"
NEXTAUTH_URL="https://tu-dominio.vercel.app"

# Vercel
VERCEL_ENV="production"
```

### Paso 3: Configurar Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Paso 4: Desplegar
1. Haz clic en "Deploy"
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El despliegue tomará 2-5 minutos

## 🔄 Configuración Post-Despliegue

### 1. Ejecutar Migraciones
En Vercel, ve a Functions y ejecuta:
```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Poblar Base de Datos
```bash
npx prisma db seed
```

### 3. Verificar Funcionalidad
- ✅ Página principal carga correctamente
- ✅ API endpoints funcionan
- ✅ Base de datos conectada
- ✅ Autenticación funciona

## 🌐 Dominio Personalizado (Opcional)

1. Ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

## 📊 Monitoreo

### Vercel Analytics
- Activa Vercel Analytics en Settings
- Monitorea el rendimiento de tu aplicación

### Logs
- Ve a Functions para ver logs en tiempo real
- Monitorea errores y rendimiento

## 🔧 Troubleshooting

### Error: "Prisma Client not initialized"
```bash
# En Vercel Functions, ejecuta:
npx prisma generate
```

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` esté correcta
- Asegúrate de que la base de datos esté activa
- Verifica que las migraciones se hayan ejecutado

### Error: "Build failed"
- Revisa los logs de build en Vercel
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate de que no haya errores de TypeScript

## 📱 Variables de Entorno por Entorno

### Development (.env.local)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret"
NODE_ENV="development"
```

### Production (Vercel)
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="production-secret-super-seguro"
NODE_ENV="production"
NEXTAUTH_URL="https://tu-dominio.vercel.app"
```

## 🎯 Checklist de Despliegue

- [ ] Repositorio subido a GitHub
- [ ] Base de datos PostgreSQL configurada
- [ ] Variables de entorno configuradas en Vercel
- [ ] Migraciones ejecutadas
- [ ] Base de datos poblada con datos iniciales
- [ ] Aplicación desplegada correctamente
- [ ] Funcionalidades principales verificadas
- [ ] Dominio personalizado configurado (opcional)
- [ ] Analytics activado (opcional)

## 🚀 URLs Importantes

- **Aplicación**: `https://tu-proyecto.vercel.app`
- **Admin Panel**: `https://tu-proyecto.vercel.app/admin`
- **API**: `https://tu-proyecto.vercel.app/api`
- **Vercel Dashboard**: `https://vercel.com/dashboard`

¡Tu aplicación IT360 Soluciones estará lista para producción! 🎉 