import mongoose from "mongoose";

const roadPolygonSchema = new mongoose.Schema(
  {
    object_id: {
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

    road_class: String,

    designation: String,

    existing_width: Number,

    planned_width: Number,

    location: String,

    length: Number,

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

roadPolygonSchema.index({ geometry: "2dsphere" });

export default mongoose.model("RoadPolygon", roadPolygonSchema);