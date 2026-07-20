import fs from "fs";

export async function importData(Model, jsonPath, collectionName) {
    try {
        const json = fs.readFileSync(jsonPath, "utf8");
        const data = JSON.parse(json);

        console.log(`📄 Loaded ${data.length} records`);

        await Model.deleteMany({});

        let imported = 0;
        let failed = 0;

        for (const doc of data) {
            try {
                await Model.create(doc);
                imported++;
            } catch (err) {
                failed++;

                console.log(
                    `❌ Failed zone_id=${doc.zone_id}, polygon_id=${doc.polygon_id}`
                );

                console.log(err.message);
            }
        }

        console.log(`✅ Imported: ${imported}`);
        console.log(`❌ Failed: ${failed}`);

    } catch (err) {
        console.error(`❌ Error importing ${collectionName}`);

        if (err.insertedDocs) {
            console.log("Inserted before failure:", err.insertedDocs.length);
        }

        console.log(err.message);
    }
}