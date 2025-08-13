// Configuración centralizada para IT360 Soluciones
export const config = {
  // Base de datos - Neon PostgreSQL
  database: {
    url: process.env.DATABASE_URL || 'postgresql://leonardobergallo:IT360_Soluciones@ep-cool-forest-a5qj8q8x-pooler.us-east-1.aws.neon.tech/it360_soluciones?sslmode=require',
  },
  
  // NextAuth - Autenticación
  auth: {
    secret: process.env.NEXTAUTH_SECRET || 'it360-secret-key-2024-secure',
    url: process.env.NEXTAUTH_URL || 'https://it360-soluciones-git-main-leonardobergallos-projects.vercel.app',
  },
  
  // Email - Resend (Principal)
  email: {
    resendApiKey: process.env.RESEND_API_KEY || 're_Hy6VDcfa_6qXBkDxARQj2xRRKQ82BV97k',
    it360Email: process.env.IT360_EMAIL || 'it360tecnologia@gmail.com',
    gmailUser: process.env.GMAIL_USER || 'it360tecnologia@gmail.com',
    gmailPass: process.env.GMAIL_PASS || 'tu-password-de-gmail',
  },
  
  // MercadoPago - Configuración de pagos
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-2de8db16-9d2b-49c4-80c5-f28020ce2244',
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || 'APP_USR-4993379468155901-052608-bd04452748d2b4cb04d557cd4203f1f4-125683753',
    clientId: process.env.MERCADOPAGO_CLIENT_ID || '4993379468155901',
    clientSecret: process.env.MERCADOPAGO_CLIENT_SECRET || 'Z0dygqJTRxRBwOMvYmCprm7C1JqlGOLS',
  },
  
  // Entorno
  env: process.env.NODE_ENV || 'development',
  
  // URLs de la aplicación
  urls: {
    base: process.env.NEXTAUTH_URL || 'https://it360-soluciones-git-main-leonardobergallos-projects.vercel.app',
    api: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api` : 'http://localhost:3000/api',
  },
  
  // Configuración de la aplicación
  app: {
    name: 'IT360 Soluciones',
    description: 'Sistema de gestión y ventas IT360',
    version: '1.0.0',
  }
};

// Función para obtener la URL de la base de datos según el entorno
export function getDatabaseUrl(): string {
  if (config.env === 'production') {
    // En producción, usar pooler de Neon
    return config.database.url.replace('-pooler', '-pooler');
  } else {
    // En desarrollo, usar conexión directa
    return config.database.url.replace('-pooler', '');
  }
}

// Función para obtener la URL de NextAuth según el entorno
export function getNextAuthUrl(): string {
  if (config.env === 'production') {
    return config.auth.url;
  } else {
    return 'http://localhost:3000';
  }
}
