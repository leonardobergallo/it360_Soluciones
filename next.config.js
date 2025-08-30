module.exports = {
  images: {
    domains: ['cdn.pixabay.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración de puertos
  env: {
    PORT: process.env.NODE_ENV === 'production' ? process.env.PORT || '3000' : '3000',
  },
}; 