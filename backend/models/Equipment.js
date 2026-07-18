import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        equipment_id: {
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

        equipment_class: {
            type: String,
            index: true,
        },

        equipment_code: String,

        designation: String,

        observation: String,

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

equipmentSchema.index({ geometry: "2dsphere" });

export default mongoose.model("Equipment", equipmentSchema);