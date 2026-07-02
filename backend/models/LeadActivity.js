const mongoose = require("mongoose");

const LeadActivitySchema = new mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            default: null
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

        locationSource: {
            type: String,
            default: ""
        },

        activityType: {
            type: String,
            enum: [
                "CONTACT_FORM",
                "VIEW_PROPERTY",
                "SCHEDULE_VISIT",
                "WHATSAPP_CLICK",
                "PROPERTY_TIME",
                "SERVICE_VIEW",
                "SERVICE_TIME",
            ],
            required: true
        },

        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            default: null
        },

        timeSpentSeconds: {
            type: Number,
            default: 0
        },

        details: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    });

module.exports =
    mongoose.models.LeadActivity ||
    mongoose.model("LeadActivity", LeadActivitySchema);