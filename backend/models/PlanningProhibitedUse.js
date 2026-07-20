import mongoose from "mongoose";

const planningProhibitedUseSchema = new mongoose.Schema(
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

        prohibition_type: {
            type: String,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

planningProhibitedUseSchema.index({
    document_id: 1,
    zone: 1,
    prohibition_type: 1,
});

export default mongoose.model(
    "PlanningProhibitedUse",
    planningProhibitedUseSchema
);