const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
    {
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact",
            required: true
        },

        visitorId: {
            type: String,
            default: null
        },

        country: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        latitude: {
            type: Number,
            default: null
        },

        longitude: {
            type: Number,
            default: null
        },

        leadScore: {
            type: Number,
            default: 0
        },

        leadCategory: {
            type: String,
            enum: ["Cold", "Warm", "Hot"],
            default: "Cold"
        },

        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        notes: {
            type: String,
            default: ""
        },

        source: {
            type: String,
            default: "website"
        },

        converted: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    });

module.exports =
    mongoose.models.Lead ||
    mongoose.model("Lead", LeadSchema);
