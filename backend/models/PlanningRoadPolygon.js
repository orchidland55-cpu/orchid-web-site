import mongoose from "mongoose";

const planningRoadPolygonSchema = new mongoose.Schema(
    {
        road_polygon_id: {
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

        planning_zone_code: Number,

        road_class: {
            type: String,
            index: true,
        },

        designation: String,

        current_width: String,

        planned_width: String,

        location: String,

        length: Number,

        observation: String,

        shape_length: Number,

        shape_area: Number,

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

planningRoadPolygonSchema.index({
    geometry: "2dsphere",
});

export default mongoose.model(
    "PlanningRoadPolygon",
    planningRoadPolygonSchema
);