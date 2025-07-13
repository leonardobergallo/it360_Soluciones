const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configuración completa de Neon para IT360 Soluciones\n');

// Función para crear archivo .env si no existe
function createEnvFile() {
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', 'env.example');
    
    if (!fs.existsSync(envPath)) {
        console.log('📝 Creando archivo .env...');
        
        if (fs.existsSync(envExamplePath)) {
            const envExample = fs.readFileSync(envExamplePath, 'utf8');
            fs.writeFileSync(envPath, envExample);
            console.log('✅ Archivo .env creado desde env.example');
        } else {
            // Crear .env básico
            const basicEnv = `# Base de datos PostgreSQL (Neon)
DATABASE_URL="postgresql://usuario:contraseña@ep-xxxxx-xxxxx.region.aws.neon.tech/it360?sslmode=require"

# NextAuth.js (para autenticación futura)
NEXTAUTH_SECRET="tu-secret-aqui-cambiar-en-produccion"
NEXTAUTH_URL="http://localhost:3000"

# Variables de entorno adicionales
NODE_ENV="development"`;
            
            fs.writeFileSync(envPath, basicEnv);
            console.log('✅ Archivo .env básico creado');
        }
        
        console.log('\n⚠️  IMPORTANTE: Edita el archivo .env con tu DATABASE_URL real de Neon');
        console.log('   Puedes obtenerla desde: https://console.neon.tech/');
        console.log('   Formato: postgresql://usuario:password@ep-xxxxx-xxxxx.region.aws.neon.tech/dbname?sslmode=require\n');
        
        return false; // Necesita configuración manual
    }
    
    return true; // Ya existe
}

// Función para verificar y corregir DATABASE_URL
function validateDatabaseUrl() {
    require('dotenv').config();
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
        console.log('❌ DATABASE_URL no está configurada');
        return false;
    }
    
    // Verificar formato básico
    const urlPattern = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+\?sslmode=require$/;
    if (!urlPattern.test(DATABASE_URL)) {
        console.log('❌ Formato de DATABASE_URL incorrecto');
        console.log('   Debe ser: postgresql://usuario:password@host:puerto/dbname?sslmode=require');
        return false;
    }
    
    // Verificar que no tenga espacios o caracteres extraños
    if (DATABASE_URL.includes('\n') || DATABASE_URL.includes('\r')) {
        console.log('❌ DATABASE_URL contiene saltos de línea');
        console.log('   Asegúrate de que esté en una sola línea');
        return false;
    }
    
    console.log('✅ Formato de DATABASE_URL válido');
    return true;
}

// Función para probar conexión
async function testConnection() {
    require('dotenv').config();
    const DATABASE_URL = process.env.DATABASE_URL;
    
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: DATABASE_URL
            }
        }
    });

    try {
        console.log('🔄 Probando conexión a Neon...');
        await prisma.$connect();
        console.log('✅ Conexión exitosa!');
        
        // Verificar tablas
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `;
        
        console.log(`📊 Tablas encontradas: ${tables.length}`);
        if (tables.length > 0) {
            tables.forEach(table => {
                console.log(`   - ${table.table_name}`);
            });
        }
        
        return true;
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        
        if (error.message.includes('Can\'t reach database server')) {
            console.log('\n🔧 La base Neon está inaccesible. Posibles causas:');
            console.log('1. La base está suspendida - Ve a https://console.neon.tech/ y reactívala');
            console.log('2. La URL es incorrecta - Copia la URL exacta del dashboard');
            console.log('3. Problemas de red - Verifica tu conexión a internet');
        }
        
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

// Función para ejecutar migraciones
async function runMigrations() {
    console.log('\n🔄 Ejecutando migraciones de Prisma...');
    
    try {
        const { execSync } = require('child_process');
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Migraciones ejecutadas correctamente');
        return true;
    } catch (error) {
        console.log('❌ Error al ejecutar migraciones:', error.message);
        return false;
    }
}

// Función para generar cliente Prisma
async function generatePrismaClient() {
    console.log('\n🔄 Generando cliente Prisma...');
    
    try {
        const { execSync } = require('child_process');
        execSync('npx prisma generate', { stdio: 'inherit' });
        console.log('✅ Cliente Prisma generado');
        return true;
    } catch (error) {
        console.log('❌ Error al generar cliente:', error.message);
        return false;
    }
}

// Función para crear productos de ejemplo
async function createSampleProducts() {
    console.log('\n🔄 Creando productos de ejemplo...');
    
    require('dotenv').config();
    const prisma = new PrismaClient();

    try {
        const products = [
            {
                name: 'Laptop HP Pavilion',
                description: 'Laptop de alto rendimiento para trabajo y gaming',
                price: 899.99,
                category: 'Laptops',
                stock: 10,
                image: '/servicio-pc.png'
            },
            {
                name: 'Mouse Gaming RGB',
                description: 'Mouse inalámbrico con iluminación RGB personalizable',
                price: 49.99,
                category: 'Periféricos',
                stock: 25,
                image: '/servicio-productos.png'
            },
            {
                name: 'Teclado Mecánico',
                description: 'Teclado mecánico con switches Cherry MX Blue',
                price: 129.99,
                category: 'Periféricos',
                stock: 15,
                image: '/servicio-productos.png'
            },
            {
                name: 'Monitor 24" Full HD',
                description: 'Monitor LED de 24 pulgadas con resolución Full HD',
                price: 199.99,
                category: 'Monitores',
                stock: 8,
                image: '/servicio-pc.png'
            },
            {
                name: 'Disco SSD 500GB',
                description: 'Disco sólido interno de 500GB para mejorar el rendimiento',
                price: 79.99,
                category: 'Almacenamiento',
                stock: 20,
                image: '/servicio-productos.png'
            }
        ];

        for (const product of products) {
            await prisma.product.upsert({
                where: { name: product.name },
                update: {},
                create: product
            });
        }

        console.log('✅ Productos de ejemplo creados');
        return true;
    } catch (error) {
        console.log('❌ Error al crear productos:', error.message);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

// Función principal
async function main() {
    console.log('📋 Pasos a seguir:\n');
    
    // Paso 1: Crear .env
    console.log('1️⃣  Verificando archivo .env...');
    const envExists = createEnvFile();
    
    if (!envExists) {
        console.log('\n⏸️  Configura manualmente el archivo .env y ejecuta este script nuevamente');
        return;
    }
    
    // Paso 2: Validar DATABASE_URL
    console.log('\n2️⃣  Validando DATABASE_URL...');
    if (!validateDatabaseUrl()) {
        console.log('\n⏸️  Corrige la DATABASE_URL en el archivo .env y ejecuta este script nuevamente');
        return;
    }
    
    // Paso 3: Probar conexión
    console.log('\n3️⃣  Probando conexión...');
    const connectionOk = await testConnection();
    
    if (!connectionOk) {
        console.log('\n⏸️  Resuelve el problema de conexión y ejecuta este script nuevamente');
        console.log('   💡 Tip: Ve a https://console.neon.tech/ y asegúrate de que la base esté "Running"');
        return;
    }
    
    // Paso 4: Generar cliente Prisma
    console.log('\n4️⃣  Generando cliente Prisma...');
    await generatePrismaClient();
    
    // Paso 5: Ejecutar migraciones
    console.log('\n5️⃣  Ejecutando migraciones...');
    const migrationsOk = await runMigrations();
    
    if (!migrationsOk) {
        console.log('\n⏸️  Resuelve los errores de migración y ejecuta este script nuevamente');
        return;
    }
    
    // Paso 6: Crear productos de ejemplo
    console.log('\n6️⃣  Creando productos de ejemplo...');
    await createSampleProducts();
    
    console.log('\n🎉 ¡Configuración completada exitosamente!');
    console.log('   Puedes iniciar tu aplicación con: npm run dev');
    console.log('   Visita: http://localhost:3000');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main }; 