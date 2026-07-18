import mongoose from "mongoose";

const planningBoundarySchema = new mongoose.Schema(
    {
        planning_code: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },

        document_id: {
            type: Number,
            required: true,
            index: true,
        },

        designation: String,

        approval_number: String,

        approval_date: Date,

        commune_id: String,

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

planningBoundarySchema.index({
    geometry: "2dsphere",
});

export default mongoose.model(
    "PlanningBoundary",
    planningBoundarySchema
);