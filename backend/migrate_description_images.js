/**
 * Script de migration MongoDB
 * Remplace les URLs WordPress (orchidisland.immo) dans les descriptions
 * par les URLs Cloudinary disponibles dans mainImage/additionalImages
 *
 * Usage:
 *   DRY_RUN=true node migrate_description_images.js   ← simulation, ne touche pas la BD
 *   node migrate_description_images.js                ← applique les changements
 *
 * Prérequis: npm install mongodb
 */

const { MongoClient } = require("mongodb");

// ── CONFIG ──────────────────────────────────────────────────────────
const MONGODB_URI = "mongodb+srv://orchidland55_db_user:orchid552026@cluster0.c7pm1fd.mongodb.net/orchidDB?appName=Cluster0";
const DB_NAME     = "orchidDB";
const COLLECTION  = "properties";
const DRY_RUN     = process.env.DRY_RUN;
// ────────────────────────────────────────────────────────────────────

function fixDescriptionImages(description, mainImage, additionalImages) {
  if (!description) return { fixed: description, replaced: 0, missing: 0 };

  const cloudinaryUrls = [mainImage, ...additionalImages].filter(Boolean);

  const wpUrls = [];
  const seen = new Set();
  for (const match of description.matchAll(
    /https:\/\/www\.orchidisland\.immo\/wp-content\/uploads\/[^\s"']+/g
  )) {
    const url = match[0];
    if (!seen.has(url)) {
      seen.add(url);
      wpUrls.push(url);
    }
  }

  if (wpUrls.length === 0) return { fixed: description, replaced: 0, missing: 0 };

  const urlMap = new Map();
  wpUrls.forEach((wpUrl, i) => {
    if (i < cloudinaryUrls.length) {
      urlMap.set(wpUrl, cloudinaryUrls[i]);
    }
  });

  let fixed = description;
  let replaced = 0;

  for (const [wpUrl, cldUrl] of urlMap) {
    const escaped = wpUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const before = fixed;
    fixed = fixed.replace(new RegExp(escaped, "g"), cldUrl);
    if (fixed !== before) replaced++;
  }

  fixed = fixed.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
  fixed = fixed.replace(/\s*data-lazyloaded="[^"]*"/g, "");
  fixed = fixed.replace(/\s*data-ll-status="[^"]*"/g, "");
  fixed = fixed.replace(/\s*data-dominant-color="[^"]*"/g, "");
  fixed = fixed.replace(/\s*data-has-transparency="[^"]*"/g, "");
  fixed = fixed.replace(/\s*data-sizes="[^"]*"/g, "");
  fixed = fixed.replace(/\s*data-src="[^"]*"/g, "");
  fixed = fixed.replace(/\s*data-srcset="[^"]*"/g, "");

  const missing = wpUrls.length - urlMap.size;
  return { fixed, replaced, missing };
}

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    if (DRY_RUN) {
      console.log("🧪 MODE DRY-RUN — aucune modification en base de données\n");
    } else {
      console.log("🚀 MODE RÉEL — les modifications seront appliquées\n");
    }

    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    const properties = await col.find({
      description: { $regex: "orchidisland\\.immo", $options: "i" }
    }).toArray();

    console.log(`🔍 ${properties.length} propriété(s) avec URLs WordPress trouvées\n`);

    let fullyMigrated = 0;
    let partiallyMigrated = 0;

    for (const prop of properties) {
      const title = (prop.title || "").slice(0, 50);
      const { fixed, replaced, missing } = fixDescriptionImages(
        prop.description,
        prop.mainImage || "",
        prop.additionalImages || []
      );

      if (!DRY_RUN) {
        await col.updateOne(
          { _id: prop._id },
          { $set: { description: fixed, updatedAt: new Date() } }
        );
      }

      if (missing === 0) {
        console.log(`  ✅ '${title}' — ${replaced} URL(s) remplacée(s)`);
        fullyMigrated++;
      } else {
        console.log(`  ⚠️  '${title}' — ${replaced} remplacée(s), ${missing} image(s) manquante(s)`);
        partiallyMigrated++;
      }
    }

    console.log(`\n${"─".repeat(65)}`);
    if (DRY_RUN) {
      console.log("🧪 SIMULATION TERMINÉE — rien n'a été modifié en base");
      console.log(`   Migration complète prévue  : ${fullyMigrated} propriété(s)`);
      console.log(`   Migration partielle prévue : ${partiallyMigrated} propriété(s)`);
      console.log(`\n   Si le résultat vous convient, relancez sans DRY_RUN=true`);
    } else {
      console.log(`✅ Migration complète  : ${fullyMigrated} propriété(s)`);
      console.log(`⚠️  Migration partielle : ${partiallyMigrated} propriété(s) (images manquantes)`);
    }
    console.log(`${"─".repeat(65)}\n`);

  } catch (err) {
    console.error("❌ Erreur:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();