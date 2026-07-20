import mongoose from "mongoose";

const planningAllowedUseSchema = new mongoose.Schema(
    {
        document_id: {
            type: String,
            required: true,
            index: true,
        },

        zone: {
            type: String,
            index: true,
        },

        article: {
            type: String,
            required: true,
        },

        article_title: String,

        text: String,

        use_type: {
            type: String,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

planningAllowedUseSchema.index({
    document_id: 1,
    zone: 1,
    use_type: 1,
});

export default mongoose.model(
    "PlanningAllowedUse",
    planningAllowedUseSchema
);