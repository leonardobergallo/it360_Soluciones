const http = require('http');

async function testSimpleConnection() {
  console.log('🧪 Probando conexión simple al servidor...\n');

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      console.log(`✅ Servidor respondiendo - Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          console.log(`📦 Productos encontrados: ${jsonData.length}`);
          console.log('🎉 ¡Conexión exitosa!');
          resolve();
        } catch (error) {
          console.log('⚠️  Respuesta no es JSON válido');
          resolve();
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error de conexión: ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.log('⏰ Timeout - El servidor no respondió en 5 segundos');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

// Ejecutar la prueba
testSimpleConnection()
  .then(() => {
    console.log('\n🌐 El servidor está funcionando en: http://localhost:3000');
  })
  .catch((error) => {
    console.log('\n❌ Error en la prueba:', error.message);
  });
