import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import PlanningDocument from "../../models/PlanningDocument.js";
import { importData } from "./utils/importData.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongoose.connect(process.env.MONGO_URI);

console.log("✅ Connected to MongoDB");

await importData(
    PlanningDocument,
    path.join(__dirname, "../../datasets/PlanningDocument.json"),
    "PlanningDocument"
);

await mongoose.disconnect();

console.log("✅ Done");