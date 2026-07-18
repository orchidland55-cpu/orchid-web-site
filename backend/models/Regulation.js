import mongoose from "mongoose";

const regulationSchema = new mongoose.Schema(
  {
    document_id: {
      type: String,
      required: true,
      index: true,
    },

    zone: {
      type: String,
      required: true,
      index: true,
    },

    article_number: Number,

    article_title: String,

    article_heading: String,

    body: String,

    rules: [
      {
        sentence: String,
        rule_type: String,
        numbers: [String],
      },
    ],

    allowed_uses: [String],

    prohibited_uses: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Regulation", regulationSchema);