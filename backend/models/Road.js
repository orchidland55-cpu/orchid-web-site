import mongoose from "mongoose";

const roadSchema = new mongoose.Schema(
    {
        road_id: {
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

        road_class: {
            type: String,
            index: true,
        },

        designation: String,

        observation: String,

        geometry: {
            type: {
                type: String,
                enum: ["LineString", "MultiLineString"],
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

roadSchema.index({ geometry: "2dsphere" });

export default mongoose.model("Road", roadSchema);