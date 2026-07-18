import fs from "fs";

export async function importData(Model, jsonPath, collectionName) {
    try {
        const json = fs.readFileSync(jsonPath, "utf8");
        const data = JSON.parse(json);

        await Model.deleteMany({});
        await Model.insertMany(data);

        console.log(`✅ ${collectionName}: ${data.length} document(s) imported`);

    } catch (err) {
        console.error(`❌ Error importing ${collectionName}`);
        console.error(err);
    }
}