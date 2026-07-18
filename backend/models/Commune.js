import mongoose from "mongoose";

const communeSchema = new mongoose.Schema(
    {
        commune_id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        full_id: String,

        name: String,

        name_ar: String,

        code_com: String,

        code_prov: String,

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

communeSchema.index({
    geometry: "2dsphere",
});

export default mongoose.model(
    "Commune",
    communeSchema
);