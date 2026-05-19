const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

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

async function ensureUniqueSlug(Article, baseSlug, excludeId) {
  let slug    = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Article.findOne(query).select('_id').lean();
    if (!existing) break;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  return slug;
}

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connecté');

  const Article = require('../models/article');

  // On cible les articles sans slug OU avec slug vide (champ existait déjà à "")
  const articles = await Article.find({
    $or: [
      { slug: { $exists: false } },
      { slug: "" },
      { slug: null }
    ]
  });

  console.log(`📦 ${articles.length} article(s) sans slug trouvé(s)\n`);

  let ok = 0;
  let ko = 0;

  for (const a of articles) {
    try {
      const base = generateSlug(a.title);
      if (!base) {
        console.warn(`⚠️  Titre vide ou invalide pour _id: ${a._id} — ignoré`);
        ko++;
        continue;
      }
      const slug = await ensureUniqueSlug(Article, base, a._id);
      await Article.findByIdAndUpdate(a._id, { slug });
      console.log(`✅ "${a.title}"\n   → ${slug}\n`);
      ok++;
    } catch (err) {
      console.error(`❌ Erreur sur "${a.title}":`, err.message);
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