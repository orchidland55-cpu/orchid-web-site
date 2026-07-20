import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import PlanningRoadPolygon from "../../models/PlanningRoadPolygon.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongoose.connect(process.env.MONGO_URI);

const file = path.join(
    __dirname,
    "../../datasets/RoadPolygon_3938.json"
);

const docs = JSON.parse(
    await (await import("fs/promises")).readFile(file)
);

await PlanningRoadPolygon.insertMany(docs);

console.log(`✅ Imported ${docs.length} repaired road polygons`);

await mongoose.disconnect();