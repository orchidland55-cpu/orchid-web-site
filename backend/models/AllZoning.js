import mongoose from "mongoose";

const allZoningSchema = new mongoose.Schema(
    {
        zone_id: {
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

        polygon_id: Number,

        zoning_code: String,

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

allZoningSchema.index({
    geometry: "2dsphere",
});

export default mongoose.model(
    "AllZoning",
    allZoningSchema
);