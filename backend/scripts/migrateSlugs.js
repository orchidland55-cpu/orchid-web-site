// scripts/migrateSlugs.js
// Lance avec : node scripts/migrateSlugs.js

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

// ── Copie de la logique depuis propertyController.js ────────────────────────

function generateSlug(title) {
  if (!title) return '';

  const cutPattern = /\s*[–—|:/]\s*|\s+-\s+/;
  const [firstPart] = title.split(cutPattern);

  const accentMap = {
    à:'a',â:'a',ä:'a',á:'a',ã:'a',
    è:'e',é:'e',ê:'e',ë:'e',
    î:'i',ï:'i',í:'i',ì:'i',
    ô:'o',ö:'o',ó:'o',ò:'o',õ:'o',
    û:'u',ü:'u',ú:'u',ù:'u',
    ç:'c',ñ:'n',
    À:'a',Â:'a',Ä:'a',Á:'a',
    È:'e',É:'e',Ê:'e',Ë:'e',
    Î:'i',Ï:'i',Ô:'o',Ö:'o',
    Û:'u',Ü:'u',Ç:'c',Ñ:'n',
  };

  return firstPart
    .replace(/[àâäáãèéêëîïíìôöóòõûüúùçñÀÂÄÁÈÉÊËÎÏÔÖÛÜÇÑ]/g, c => accentMap[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function ensureUniqueSlug(Property, baseSlug, excludeId) {
  let slug    = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Property.findOne(query).select('_id').lean();
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

// ── Migration ────────────────────────────────────────────────────────────────

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connecté');

  // Import du modèle APRÈS la connexion
  const Property = require('../models/Property');

  const props = await Property.find({ slug: { $exists: false } });
  console.log(`📦 ${props.length} propriété(s) sans slug trouvée(s)\n`);

  let ok = 0;
  let ko = 0;

  for (const p of props) {
    try {
      const base = generateSlug(p.title);
      if (!base) {
        console.warn(`⚠️  Titre vide ou invalide pour _id: ${p._id} — ignoré`);
        ko++;
        continue;
      }
      const slug = await ensureUniqueSlug(Property, base, p._id);
      await Property.findByIdAndUpdate(p._id, { slug });
      console.log(`✅ "${p.title}"\n   → ${slug}\n`);
      ok++;
    } catch (err) {
      console.error(`❌ Erreur sur "${p.title}":`, err.message);
      ko++;
    }
  }

  console.log(`\n🎉 Migration terminée — ${ok} OK  /  ${ko} erreurs`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});