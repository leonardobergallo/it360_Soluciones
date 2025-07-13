# IT360 - Sistema de Gestión de Servicios Informáticos

Sistema web completo para la gestión de una empresa de servicios informáticos que ofrece desarrollo web, soporte técnico y venta de productos tecnológicos.

## 🚀 Características

- **Gestión de Usuarios**: Sistema de roles (ADMIN, TECNICO, USER)
- **Gestión de Servicios**: Desarrollo web y soporte técnico
- **Gestión de Productos**: Inventario de insumos tecnológicos
- **Gestión de Ventas**: Registro de transacciones
- **Panel de Administración**: Interfaz para gestión completa
- **API REST**: Endpoints para todas las operaciones CRUD

## 🛠️ Tecnologías

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Next.js API Routes
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Estilos**: TailwindCSS
- **Lenguaje**: TypeScript

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL
- npm o yarn

## 🔧 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd it360
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura la base de datos:**
   - Crea una base de datos PostgreSQL llamada `it360`
   - Copia el archivo `.env.example` a `.env`
   - Actualiza la URL de la base de datos en `.env`:
     ```
     DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/it360"
     ```

4. **Inicializa la base de datos:**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Genera el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

6. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

7. **Abre tu navegador:**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
it360/
├── app/                    # App Router de Next.js
│   ├── api/               # Rutas API
│   │   ├── users/         # API de usuarios
│   │   ├── services/      # API de servicios
│   │   ├── products/      # API de productos
│   │   └── sales/         # API de ventas
│   ├── admin/             # Panel de administración
│   └── page.tsx           # Página principal
├── lib/                   # Utilidades
│   └── prisma.ts          # Cliente de Prisma
├── prisma/                # Configuración de Prisma
│   └── schema.prisma      # Modelos de base de datos
└── public/                # Archivos estáticos
```

## 🗄️ Modelos de Base de Datos

### User
- `id`: UUID (clave primaria)
- `email`: String (único)
- `password`: String
- `name`: String
- `role`: Enum (ADMIN, TECNICO, USER)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Service
- `id`: UUID (clave primaria)
- `name`: String
- `description`: String
- `price`: Float
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Product
- `id`: UUID (clave primaria)
- `name`: String
- `description`: String
- `price`: Float
- `stock`: Int
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Sale
- `id`: UUID (clave primaria)
- `userId`: String (relación con User)
- `productId`: String? (relación opcional con Product)
- `serviceId`: String? (relación opcional con Service)
- `amount`: Float
- `createdAt`: DateTime

## 🔌 API Endpoints

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `POST /api/users` - Crear nuevo usuario

### Servicios
- `GET /api/services` - Obtener todos los servicios
- `POST /api/services` - Crear nuevo servicio

### Productos
- `GET /api/products` - Obtener todos los productos
- `POST /api/products` - Crear nuevo producto

### Ventas
- `GET /api/sales` - Obtener todas las ventas
- `POST /api/sales` - Crear nueva venta

## 🚀 Despliegue

### Railway
1. Conecta tu repositorio a Railway
2. Configura las variables de entorno
3. Railway detectará automáticamente que es un proyecto Next.js

### Vercel
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Vercel desplegará automáticamente

### Supabase/Neon
1. Crea una base de datos en Supabase o Neon
2. Actualiza la `DATABASE_URL` en las variables de entorno
3. Ejecuta las migraciones en producción

## 🔐 Seguridad

- Las contraseñas deben ser hasheadas en producción
- Implementar autenticación con NextAuth.js
- Validar inputs en todas las APIs
- Configurar CORS apropiadamente

## 📝 Próximos Pasos

- [ ] Implementar autenticación con NextAuth.js
- [ ] Agregar validación de formularios
- [ ] Implementar filtros y búsqueda
- [ ] Agregar reportes y estadísticas
- [ ] Implementar notificaciones
- [ ] Agregar tests unitarios

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor abre un issue en el repositorio.
