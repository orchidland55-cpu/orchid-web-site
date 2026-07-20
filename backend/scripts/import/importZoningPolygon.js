import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import ZoningPolygon from "../../models/ZoningPolygon.js";
import { importData } from "./utils/importData.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongoose.connect(process.env.MONGO_URI);

console.log("✅ Connected to MongoDB");

await importData(
    ZoningPolygon,
    path.join(__dirname, "../../datasets/ZoningPolygon.json"),
    "ZoningPolygon"
);

await mongoose.disconnect();

console.log("✅ Done");