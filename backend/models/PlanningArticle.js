import mongoose from "mongoose";

const planningArticleSchema = new mongoose.Schema(
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

        article_number: {
            type: String,
            required: true,
        },

        article_heading: String,

        article_title: String,

        raw_text: String,

        body: String,

        word_count: Number,

        char_count: Number,
    },
    {
        timestamps: true,
    }
);

planningArticleSchema.index({
    document_id: 1,
    zone: 1,
    article_number: 1,
});

export default mongoose.model(
    "PlanningArticle",
    planningArticleSchema
);