const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const services = [
  {
    name: "Soporte Técnico PC",
    description: "Reparación y mantenimiento de computadoras y notebooks. Optimización del sistema operativo, eliminación de virus, backup y recuperación de datos, instalación de programas y drivers.",
    price: 15000,
    active: true,
    order: 1
  },
  {
    name: "Configuración de Redes",
    description: "Configuración de redes WiFi y cableadas. Instalación y optimización de routers, repetidores y puntos de acceso. Solución de problemas de conectividad y velocidad.",
    price: 25000,
    active: true,
    order: 2
  },
  {
    name: "Desarrollo de Software",
    description: "Sistemas web personalizados para empresas, comercios o profesionales. Paneles de gestión, administración de turnos, stock, facturación. Formularios inteligentes y reportes automáticos.",
    price: 150000,
    active: true,
    order: 3
  },
  {
    name: "Desarrollo de Apps Móviles",
    description: "Desarrollo de apps para Android e iOS. Interfaz amigable, personalizada para tu negocio. Funciones como geolocalización, notificaciones, acceso por usuario y autenticación segura.",
    price: 200000,
    active: true,
    order: 4
  },
  {
    name: "Venta de Productos IT",
    description: "Accesorios, periféricos, routers, memorias, discos externos. Productos seleccionados de marcas reconocidas. Asesoramiento para elegir lo mejor para tu necesidad.",
    price: 0,
    active: true,
    order: 5
  },
  {
    name: "Ciberseguridad",
    description: "Auditorías de seguridad informática. Implementación de políticas de seguridad. Protección contra malware y ransomware. Configuración de firewalls y antivirus.",
    price: 50000,
    active: true,
    order: 6
  },
  {
    name: "Consultoría IT",
    description: "Análisis de necesidades tecnológicas. Planificación estratégica de IT. Evaluación de infraestructura existente. Recomendaciones de mejora y roadmap de implementación.",
    price: 30000,
    active: true,
    order: 7
  },
  {
    name: "Hogar Inteligente",
    description: "Automatización de iluminación y climatización. Sistemas de seguridad inteligentes. Control de electrodomésticos. Integración con asistentes de voz y monitoreo remoto.",
    price: 80000,
    active: true,
    order: 8
  }
];

async function seedServices() {
  try {
    console.log('🌱 Iniciando seed de servicios...');
    
    // Limpiar servicios existentes
    await prisma.service.deleteMany({});
    console.log('🗑️ Servicios existentes eliminados');
    
    // Insertar nuevos servicios
    for (const service of services) {
      await prisma.service.create({
        data: service
      });
      console.log(`✅ Servicio creado: ${service.name}`);
    }
    
    console.log(`🎉 ${services.length} servicios creados exitosamente`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedServices();
