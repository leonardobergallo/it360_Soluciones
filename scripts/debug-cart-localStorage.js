console.log('🛒 Debuggeando localStorage del carrito...\n');

function debugCartLocalStorage() {
  console.log('📋 Verificando localStorage...');
  
  // Simular lo que hay en localStorage
  const carritoStored = localStorage.getItem('carrito');
  
  if (carritoStored) {
    console.log('✅ Carrito encontrado en localStorage');
    console.log('📄 Contenido raw:');
    console.log(carritoStored);
    
    try {
      const carrito = JSON.parse(carritoStored);
      console.log('\n📊 Carrito parseado:');
      console.log(JSON.stringify(carrito, null, 2));
      
      console.log('\n🔍 Análisis de estructura:');
      if (Array.isArray(carrito)) {
        console.log(`   📦 Total de items: ${carrito.length}`);
        
        carrito.forEach((item, index) => {
          console.log(`\n   Item ${index + 1}:`);
          console.log(`   - Tipo: ${typeof item}`);
          console.log(`   - Keys: ${Object.keys(item).join(', ')}`);
          console.log(`   - Tiene 'product': ${item.hasOwnProperty('product')}`);
          console.log(`   - Tiene 'productId': ${item.hasOwnProperty('productId')}`);
          console.log(`   - Tiene 'name': ${item.hasOwnProperty('name')}`);
          console.log(`   - Tiene 'price': ${item.hasOwnProperty('price')}`);
          console.log(`   - Tiene 'quantity': ${item.hasOwnProperty('quantity')}`);
          
          if (item.product) {
            console.log(`   - Product keys: ${Object.keys(item.product).join(', ')}`);
          }
        });
      } else {
        console.log('   ❌ El carrito no es un array');
      }
    } catch (error) {
      console.log('   ❌ Error parseando JSON:', error.message);
    }
  } else {
    console.log('❌ No hay carrito en localStorage');
  }
  
  console.log('\n💡 Para ver el carrito en el navegador:');
  console.log('   1. Abre las herramientas de desarrollador (F12)');
  console.log('   2. Ve a la pestaña "Application" o "Aplicación"');
  console.log('   3. En el panel izquierdo, busca "Local Storage"');
  console.log('   4. Haz clic en tu dominio (localhost:3001)');
  console.log('   5. Busca la clave "carrito"');
  console.log('   6. Copia el valor y pégalo aquí para analizarlo');
}

// También mostrar instrucciones para el navegador
console.log('🌐 Para debuggear en el navegador:');
console.log('   1. Ve a: http://localhost:3001/carrito');
console.log('   2. Abre la consola (F12)');
console.log('   3. Ejecuta: console.log(localStorage.getItem("carrito"))');
console.log('   4. Ejecuta: console.log(JSON.parse(localStorage.getItem("carrito")))');
console.log('\n');

debugCartLocalStorage(); 