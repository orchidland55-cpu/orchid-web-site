import mongoose from "mongoose";

const planningRuleSchema = new mongoose.Schema(
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

        article_title: String,

        sentence: String,

        rule_type: {
            type: String,
            index: true,
        },

        numbers: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

planningRuleSchema.index({
    document_id: 1,
    zone: 1,
    rule_type: 1,
});

export default mongoose.model(
    "PlanningRule",
    planningRuleSchema
);