// scripts/get-assets.js
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/assets');
const files = fs.readdirSync(distPath);

const cssFiles = files.filter(f => f.endsWith('.css') && !f.includes('.map'));
const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes('.map'));

console.log('CSS Files:', cssFiles);
console.log('JS Files:', jsFiles);

// Générer les noms pour l'index.html
cssFiles.forEach(f => {
  if (f.startsWith('index-')) {
    console.log(`indexCSS: ${f}`);
  }
  if (f.startsWith('react-vendor-')) {
    console.log(`reactVendorCSS: ${f}`);
  }
});