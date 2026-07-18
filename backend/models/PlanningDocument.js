import mongoose from "mongoose";

const planningDocumentSchema = new mongoose.Schema(
    {
        document_id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
        },

        agency: String,

        region: String,

        prefecture: String,

        commune: String,

        document_type: String,

        publication_year: Number,

        language: String,

        pdf_file: String,

        total_pages: Number,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "PlanningDocument",
    planningDocumentSchema
);