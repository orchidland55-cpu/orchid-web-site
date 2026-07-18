import mongoose from "mongoose";

const zoningPolygonSchema = new mongoose.Schema(
    {
        polygon_id: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },

        planning_code: {
            type: Number,
            required: true,
            index: true,
        },

        document_id: {
            type: String,
            required: true,
            index: true,
        },

        zoning_code: {
            type: String,
            required: true,
            index: true,
        },

        designation: String,

        summary: String,

        category: String,

        geometry: {
            type: {
                type: String,
                enum: ["Polygon", "MultiPolygon"],
                required: true,
            },
            coordinates: {
                type: Array,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

zoningPolygonSchema.index({ geometry: "2dsphere" });

export default mongoose.model("ZoningPolygon", zoningPolygonSchema);