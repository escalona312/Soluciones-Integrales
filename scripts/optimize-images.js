const fs = require('fs');
const path = require('path');

// Función para optimizar imágenes
function optimizeImages() {
  const imageDirs = ['images', 'galeria'];
  
  imageDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Optimizando imágenes en ${dir}...`);
      
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile()) {
          const ext = path.extname(file).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            console.log(`  - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
          }
        }
      });
    }
  });
  
  console.log('\n✅ Optimización de imágenes completada');
  console.log('\n💡 Recomendaciones para optimización manual:');
  console.log('  1. Convertir imágenes grandes a formato WebP');
  console.log('  2. Comprimir imágenes JPEG con calidad 80-85%');
  console.log('  3. Redimensionar imágenes a tamaños apropiados');
  console.log('  4. Usar lazy loading para imágenes fuera de pantalla');
}

// Ejecutar optimización
optimizeImages(); 