# 🚀 Migración de SQLite a Neon PostgreSQL

Esta guía te ayudará a migrar tu base de datos de SQLite local a Neon PostgreSQL en la nube.

## 📋 Prerrequisitos

1. **Cuenta en Neon**: Regístrate en [neon.tech](https://neon.tech)
2. **Node.js y npm**: Asegúrate de tener las dependencias instaladas
3. **Datos de respaldo**: Haz una copia de seguridad de tu base de datos actual

## 🔧 Configuración de Neon

### 1. Crear proyecto en Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Crea un nuevo proyecto
3. Anota la URL de conexión que te proporcionan

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos PostgreSQL (Neon)
DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx-xxxxx.region.aws.neon.tech/it360?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="tu-secret-aqui-cambiar-en-produccion"
NEXTAUTH_URL="http://localhost:3000"

# Variables de entorno adicionales
NODE_ENV="development"
```

**⚠️ IMPORTANTE**: Reemplaza la URL con la que te proporciona Neon.

## 🗄️ Migración de Datos

### Opción 1: Migración Automática (Recomendada)

Ejecuta el script de migración automática:

```bash
# Generar el cliente de Prisma para Neon
npx prisma generate

# Ejecutar migraciones en Neon
npx prisma migrate deploy

# Ejecutar el script de migración de datos
node scripts/migrate-to-neon.js
```

### Opción 2: Migración Manual

Si prefieres migrar manualmente:

```bash
# 1. Generar el cliente de Prisma
npx prisma generate

# 2. Crear las tablas en Neon
npx prisma migrate deploy

# 3. Ejecutar el seed si es necesario
npx prisma db seed
```

## 🔍 Verificación

### 1. Verificar conexión

```bash
# Probar conexión a Neon
npx prisma studio
```

### 2. Verificar datos migrados

```bash
# Ejecutar una consulta de prueba
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const services = await prisma.service.count();
  
  console.log('Usuarios:', users);
  console.log('Productos:', products);
  console.log('Servicios:', services);
  
  await prisma.$disconnect();
}

test();
"
```

## 🧹 Limpieza Post-Migración

Una vez que hayas verificado que todo funciona correctamente:

1. **Eliminar archivo SQLite** (opcional):
   ```bash
   rm prisma/dev.db
   ```

2. **Actualizar .gitignore**:
   ```gitignore
   # Eliminar la línea que ignora dev.db si ya no la necesitas
   # prisma/dev.db
   ```

3. **Actualizar documentación**:
   - Actualiza README.md con las nuevas instrucciones
   - Actualiza las variables de entorno en producción

## 🚨 Solución de Problemas

### Error de conexión SSL

Si tienes problemas con SSL, asegúrate de que tu URL incluya `?sslmode=require`:

```
DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx-xxxxx.region.aws.neon.tech/it360?sslmode=require"
```

### Error de migración

Si las migraciones fallan:

```bash
# Resetear la base de datos (¡CUIDADO! Esto borra todos los datos)
npx prisma migrate reset

# O crear una nueva migración
npx prisma migrate dev --name init
```

### Error de tipos UUID

Si tienes problemas con UUIDs:

```bash
# Regenerar el cliente de Prisma
npx prisma generate
```

## 📊 Ventajas de Neon

- **Escalabilidad**: Crece automáticamente según la demanda
- **Rendimiento**: Optimizado para aplicaciones web
- **Fiabilidad**: 99.9% de disponibilidad
- **Seguridad**: SSL/TLS por defecto
- **Backups automáticos**: Sin configuración adicional
- **Conexiones serverless**: Ideal para Next.js

## 🔄 Rollback (Si es necesario)

Si necesitas volver a SQLite:

1. Cambia el `provider` en `schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Regenera el cliente:
   ```bash
   npx prisma generate
   ```

3. Ejecuta las migraciones:
   ```bash
   npx prisma migrate dev
   ```

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs de Neon en la consola
2. Verifica la configuración de red y firewall
3. Consulta la [documentación de Neon](https://neon.tech/docs)
4. Revisa los logs de Prisma con `DEBUG=prisma:*`

---

**¡Feliz migración! 🎉** 