# 🚀 Migración a Neon PostgreSQL - Guía Rápida

## ⚡ Pasos Rápidos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Crear archivo .env
Crea un archivo `.env` en la raíz del proyecto con tu URL de Neon:

```env
DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx-xxxxx.region.aws.neon.tech/it360?sslmode=require"
NEXTAUTH_SECRET="tu-secret-aqui-cambiar-en-produccion"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Verificar configuración
```bash
npm run verify:neon
```

### 4. Crear tablas en Neon
```bash
npm run db:deploy
```

### 5. Migrar datos (opcional)
```bash
npm run migrate:neon
```

### 6. Probar la aplicación
```bash
npm run dev
```

## 📋 Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `npm run verify:neon` | Verifica la configuración de Neon |
| `npm run db:deploy` | Crea las tablas en Neon |
| `npm run migrate:neon` | Migra datos de SQLite a Neon |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:seed` | Ejecuta el seed de datos |

## 🔧 Configuración de Neon

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Crea un nuevo proyecto
3. Copia la URL de conexión
4. Reemplaza en tu archivo `.env`

## 🚨 Solución de Problemas

### Error de conexión
- Verifica que la URL incluya `?sslmode=require`
- Asegúrate de que el proyecto esté activo en Neon
- Revisa la configuración de red/firewall

### Error de migración
```bash
# Resetear migraciones
npx prisma migrate reset

# Crear nueva migración
npx prisma migrate dev --name init
```

### Error de tipos
```bash
# Regenerar cliente
npx prisma generate
```

## 📞 Soporte

- [Documentación de Neon](https://neon.tech/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- Revisa `MIGRACION-NEON.md` para detalles completos

---

**¡Listo para usar Neon! 🎉** 