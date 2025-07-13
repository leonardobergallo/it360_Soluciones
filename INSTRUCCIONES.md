# 🚀 IT360 - Instrucciones Rápidas

## Configuración Inicial

### 1. Configurar Base de Datos
```bash
# Copia el archivo de ejemplo
cp env.example .env

# Edita el archivo .env con tus credenciales de PostgreSQL
# DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/it360"
```

### 2. Ejecutar Script de Configuración
```bash
npm run setup
```

### 3. Crear Base de Datos
```bash
# Asegúrate de tener PostgreSQL corriendo
# Crea una base de datos llamada 'it360'

# Ejecuta las migraciones
npm run db:migrate
```

### 4. Iniciar el Proyecto
```bash
npm run dev
```

### 5. Abrir en el Navegador
```
http://localhost:3000
```

## 📁 Estructura Creada

- ✅ **Landing Page**: Página principal con diseño moderno
- ✅ **Panel Admin**: `/admin` - Panel de administración
- ✅ **API Users**: `/api/users` - CRUD de usuarios
- ✅ **API Services**: `/api/services` - CRUD de servicios  
- ✅ **API Products**: `/api/products` - CRUD de productos
- ✅ **API Sales**: `/api/sales` - CRUD de ventas
- ✅ **Base de Datos**: Modelos con relaciones completas
- ✅ **Sistema de Roles**: ADMIN, TECNICO, USER

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción

# Base de Datos
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio

# Utilidades
npm run setup        # Configuración inicial
npm run lint         # Verificar código
```

## 🌐 URLs Importantes

- **Home**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **API Users**: http://localhost:3000/api/users
- **API Services**: http://localhost:3000/api/services
- **API Products**: http://localhost:3000/api/products
- **API Sales**: http://localhost:3000/api/sales

## 📝 Próximos Pasos

1. **Configurar autenticación** con NextAuth.js
2. **Agregar formularios** para crear/editar entidades
3. **Implementar filtros** y búsqueda
4. **Agregar reportes** y estadísticas
5. **Configurar despliegue** en Railway/Vercel

## 🆘 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo
- Confirma las credenciales en `.env`
- Asegúrate de que la base de datos `it360` exista

### Error de Prisma
```bash
npm install prisma @prisma/client
npx prisma generate
```

### Error de dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

¡Listo para desarrollar! 🎉 