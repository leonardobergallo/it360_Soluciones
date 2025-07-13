const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico de conexión a Neon...\n');

// Verificar si existe el archivo .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ No se encontró el archivo .env');
    console.log('📝 Creando archivo .env desde env.example...');
    
    const envExamplePath = path.join(__dirname, '..', 'env.example');
    if (fs.existsSync(envExamplePath)) {
        const envExample = fs.readFileSync(envExamplePath, 'utf8');
        fs.writeFileSync(envPath, envExample);
        console.log('✅ Archivo .env creado. Por favor, edítalo con tu DATABASE_URL real.');
    } else {
        console.log('❌ No se encontró env.example');
    }
    process.exit(1);
}

// Cargar variables de entorno
require('dotenv').config({ path: envPath });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.log('❌ DATABASE_URL no está configurada en .env');
    console.log('📝 Por favor, agrega tu URL de conexión de Neon al archivo .env');
    console.log('   Ejemplo: DATABASE_URL="postgresql://usuario:password@ep-xxxxx-xxxxx.region.aws.neon.tech/dbname?sslmode=require"');
    process.exit(1);
}

console.log('✅ DATABASE_URL encontrada');
console.log(`📍 Host: ${DATABASE_URL.match(/@([^:]+):/)?.[1] || 'No encontrado'}`);
console.log(`🗄️  Base de datos: ${DATABASE_URL.match(/\/([^?]+)\?/)?.[1] || 'No encontrada'}\n`);

// Probar conexión
async function testConnection() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: DATABASE_URL
            }
        }
    });

    try {
        console.log('🔄 Probando conexión a Neon...');
        
        // Test básico de conexión
        await prisma.$connect();
        console.log('✅ Conexión exitosa a Neon!');
        
        // Verificar tablas
        console.log('\n📊 Verificando tablas...');
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `;
        
        if (tables.length > 0) {
            console.log('✅ Tablas encontradas:');
            tables.forEach(table => {
                console.log(`   - ${table.table_name}`);
            });
        } else {
            console.log('⚠️  No se encontraron tablas. Ejecuta las migraciones:');
            console.log('   npx prisma migrate deploy');
        }
        
        // Verificar productos
        try {
            const productCount = await prisma.product.count();
            console.log(`\n📦 Productos en la base de datos: ${productCount}`);
            
            if (productCount === 0) {
                console.log('⚠️  No hay productos. Puedes agregar algunos desde el dashboard de Neon o ejecutar un script de seed.');
            }
        } catch (error) {
            console.log('❌ Error al verificar productos:', error.message);
        }
        
    } catch (error) {
        console.log('❌ Error de conexión:', error.message);
        
        if (error.message.includes('Can\'t reach database server')) {
            console.log('\n🔧 Posibles soluciones:');
            console.log('1. Verifica que tu base Neon esté activa en https://console.neon.tech/');
            console.log('2. Asegúrate de que el estado sea "Running" (no "Suspended" o "Idle")');
            console.log('3. Copia la URL de conexión correcta desde el dashboard de Neon');
            console.log('4. Verifica que la URL no tenga espacios o caracteres extraños');
        } else if (error.message.includes('authentication failed')) {
            console.log('\n🔧 Error de autenticación:');
            console.log('1. Verifica el usuario y contraseña en la URL de conexión');
            console.log('2. Asegúrate de que las credenciales sean correctas');
        } else if (error.message.includes('database does not exist')) {
            console.log('\n🔧 Base de datos no existe:');
            console.log('1. Verifica el nombre de la base de datos en la URL');
            console.log('2. Crea la base de datos desde el dashboard de Neon');
        }
    } finally {
        await prisma.$disconnect();
    }
}

testConnection(); 