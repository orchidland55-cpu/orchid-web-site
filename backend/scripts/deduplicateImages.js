require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('../models/Property'); // ← ajuste le chemin si besoin

async function deduplicateImages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connecté à MongoDB');

  const properties = await Property.find({});
  let fixedCount = 0;

  for (const property of properties) {
    const original = property.additionalImages;
    const deduplicated = [...new Set(original)];

    if (deduplicated.length < original.length) {
      property.additionalImages = deduplicated;
      await property.save();
      console.log(`🔧 Corrigé : "${property.title}" — ${original.length} → ${deduplicated.length} images`);
      fixedCount++;
    }
  }

  if (fixedCount === 0) {
    console.log('✨ Aucun doublon trouvé');
  } else {
    console.log(`\n✅ ${fixedCount} propriété(s) corrigée(s)`);
  }

  await mongoose.disconnect();
  console.log('🔌 Déconnecté');
}

deduplicateImages().catch((err) => {
  console.error('❌ Erreur :', err);
  process.exit(1);
});