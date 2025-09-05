const fs = require('fs');

const files = fs.readdirSync('public/images');
const images = files.filter(f => f.match(/\.(jpg|png|jpeg|gif|webp)$/i));

console.log('🖼️ IMÁGENES DISPONIBLES:');
console.log('=' .repeat(40));
console.log(`Total: ${images.length} imágenes`);
console.log('');

images.forEach((img, i) => {
  console.log(`${i + 1}. ${img}`);
});
