const Lead = require("../models/Lead");
const LeadActivity = require("../models/LeadActivity");
const Property = require("../models/Property");
const { createOdooLead } = require("../services/odooService");


const mongoose = require("mongoose");

async function syncLeadToOdoo(visitorId) {

    console.log("=== ODOO SYNC START ===");
    console.log("visitorId:", visitorId);

    const lead = await Lead.findOne({ visitorId });

    if (!lead) {
        console.log("❌ No lead found");
        return;
    }

    console.log("✅ Lead found:", lead._id);

    const contact = await mongoose.connection.db
        .collection("contacts")
        .findOne({
            _id: lead.contactId
        });

    if (!contact) {
        console.log("❌ No contact found");
        return;
    }

    console.log("✅ Contact found:", contact.name);
    const propertyViews = await LeadActivity.countDocuments({
        visitorId,
        activityType: "VIEW_PROPERTY"
    });

    const whatsappClicks = await LeadActivity.countDocuments({
        visitorId,
        activityType: "WHATSAPP_CLICK"
    });

    const scheduleVisits = await LeadActivity.countDocuments({
        visitorId,
        activityType: "SCHEDULE_VISIT"
    });

    const viewedActivities = await LeadActivity.find({
        visitorId,
        activityType: "VIEW_PROPERTY"
    }).select("propertyId timeSpentSeconds");

    const serviceViews = await LeadActivity.find({
        visitorId,
        activityType: "SERVICE_VIEW"
    });

    const serviceTimes = await LeadActivity.find({
        visitorId,
        activityType: "SERVICE_TIME"
    });

    const propertyIds = viewedActivities.map(
        activity => activity.propertyId
    );

    const propertyViewCounts = {};

    const propertyTimeTotals = {};

    const serviceViewCounts = {};

    const serviceTimeTotals = {};

    const propertyTimeActivities = await LeadActivity.find({
        visitorId,
        activityType: "PROPERTY_TIME"
    }).select("propertyId timeSpentSeconds");

    viewedActivities.forEach(activity => {
        const id = activity.propertyId.toString();

        propertyViewCounts[id] =
            (propertyViewCounts[id] || 0) + 1;
    });

    propertyTimeActivities.forEach(activity => {
        const id = activity.propertyId.toString();

        propertyTimeTotals[id] =
            (propertyTimeTotals[id] || 0) +
            (activity.timeSpentSeconds || 0);
    });

    serviceViews.forEach(activity => {

        const serviceName = activity.details;

        serviceViewCounts[serviceName] =
            (serviceViewCounts[serviceName] || 0) + 1;
    });

    serviceTimes.forEach(activity => {

        const serviceName = activity.details;

        serviceTimeTotals[serviceName] =
            (serviceTimeTotals[serviceName] || 0) +
            (activity.timeSpentSeconds || 0);
    });

    const properties = await Property.find({
        _id: { $in: Object.keys(propertyViewCounts) }
    }).select("title");

    const propertyList = properties
        .map(property => {

            const id = property._id.toString();

            const count =
                propertyViewCounts[id] || 0;

            const totalSeconds =
                propertyTimeTotals[id] || 0;

            const minutes =
                Math.floor(totalSeconds / 60);

            const seconds =
                totalSeconds % 60;

            return `
            ${property.title}

            • Viewed ${count} times
            • Time spent: ${minutes}m ${seconds}s
            `;
        })
        .join("\n\n");


    //will see
    // ===============================
    // LEAD SCORE CALCULATION
    // ===============================

    let score = 0;

    // Contact Form

    if (contact.name) score += 2;
    if (contact.email) score += 2;
    if (contact.phone) score += 2;
    if (contact.message) score += 2;

    // Visit Request

    if (scheduleVisits > 0) {
        score += 8;
    }

    // Property Engagement

    const TOTAL_PROPERTIES = 30;

    const uniquePropertiesViewed =
        Object.keys(propertyViewCounts).length;

    const propertyScore =
        30 *
        Math.sqrt(uniquePropertiesViewed / TOTAL_PROPERTIES);

    score += Math.min(propertyScore, 30);

    // Property Reading Time

    const totalSeconds =
        Object.values(propertyTimeTotals)
            .reduce((a, b) => a + b, 0);

    const totalMinutes =
        totalSeconds / 60;

    const MAX_REFERENCE_TIME = 20;

    const timeScore =
        30 *
        Math.sqrt(totalMinutes / MAX_REFERENCE_TIME);

    score += Math.min(timeScore, 30);

    // Services

    const TOTAL_SERVICES = 7;

    const uniqueServices =
        Object.keys(serviceViewCounts).length;

    const serviceScore =
        8 *
        Math.sqrt(uniqueServices / TOTAL_SERVICES);

    score += Math.min(serviceScore, 8);

    // WhatsApp

    if (whatsappClicks > 0)
        score += 8;

    // Returning visitor

    const activityCount =
        await LeadActivity.countDocuments({
            visitorId
        });

    if (activityCount > 1)
        score += 8;

    score =
        Math.min(Math.round(score), 100);

    // Category

    lead.leadScore = score;

    lead.leadCategory =
        score >= 80
            ? "Hot"
            : score >= 40
                ? "Warm"
                : "Cold";

    await lead.save();

    console.log("Lead Score:", score);

    //ends here



    console.log("=== ODOO DATA ===");
    console.log({
        propertyViews,
        whatsappClicks,
        scheduleVisits
    });
    const odooPropertyList = propertyList;

    console.log("SERVICE TIMES:");
    console.log(serviceTimeTotals);

    console.log("SERVICE VIEWS:");
    console.log(serviceViewCounts);

    const servicesList = Object.keys(serviceViewCounts)
        .map(service => {

            const views =
                serviceViewCounts[service] || 0;

            const totalSeconds =
                serviceTimeTotals[service] || 0;

            const minutes =
                Math.floor(totalSeconds / 60);

            const seconds =
                totalSeconds % 60;

            return `
${service}

• Viewed ${views} times
• Time spent: ${minutes}m ${seconds}s
`;
        })
        .join("\n\n");

    console.log("CONTACT ODOO LOCATION:", {
        country: lead.country,
        city: lead.city,
        latitude: lead.latitude,
        longitude: lead.longitude
    });

    const aiAnalytics = await getLeadAIAnalytics(visitorId);

    await createOdooLead({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject || "",
        country: lead.country,
        city: lead.city,
        latitude: lead.latitude,
        longitude: lead.longitude,
        message: contact.message || "",
        visitorId,

        leadScore: lead.leadScore,

        propertyViews,
        whatsappClicks,
        scheduleVisits,

        propertyList: odooPropertyList,
        servicesList,

        ...aiAnalytics
    });

    console.log("✅ Odoo auto-sync completed");
}
const trackPropertyView = async (req, res) => {
    try {
        const {
            propertyId,
            visitorId,
            country,
            city,
            latitude,
            longitude,
            locationSource,
            trafficSource,
            trafficMedium
        } = req.body;

        let detectedCountry = country;
        let detectedCity = city;

        if (locationSource === "denied") {

            detectedCountry = "Morocco";
            detectedCity = "Casablanca";
        }

        if (
            locationSource === "gps" &&
            latitude &&
            longitude
        ) {
            try {

                const axios = require("axios");

                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                    {
                        headers: {
                            "User-Agent": "OrchidIsland/1.0"
                        }
                    }
                );

                console.log(response.data.address);

                detectedCountry =
                    response.data.address?.country_code?.toUpperCase() === "MA"
                        ? "Morocco"
                        : response.data.address?.country || "";

                detectedCity =
                    response.data.address?.city ||
                    response.data.address?.town ||
                    response.data.address?.village ||
                    "";
                detectedCity = detectedCity.split(" ")[0];

                console.log("GPS LOCATION:", {
                    country: detectedCountry,
                    city: detectedCity
                });

            } catch (err) {

                console.error(
                    "Reverse geocoding failed:",
                    err.message
                );
            }
        }

        console.log("LOCATION DATA:", {
            country,
            city,
            latitude,
            longitude,
            locationSource
        });

        console.log("SAVING ACTIVITY:", {
            country: detectedCountry,
            city: detectedCity,
            latitude,
            longitude,
            locationSource
        });
        const createdActivity = await LeadActivity.create({
            visitorId,
            activityType: "VIEW_PROPERTY",
            propertyId,
            details: "Property viewed",

            country: detectedCountry,
            city: detectedCity,

            latitude,
            longitude,

            locationSource,

            trafficSource,
            trafficMedium
        });

        console.log("CREATED ACTIVITY:", createdActivity);

        const Lead = require("../models/Lead");

        const lead = await Lead.findOne({ visitorId });

        console.log("FOUND LEAD:", lead)

        if (lead) {

            if (detectedCountry)
                lead.country = detectedCountry;

            if (detectedCity)
                lead.city = detectedCity;

            if (latitude)
                lead.latitude = latitude;

            if (longitude)
                lead.longitude = longitude;
            await lead.save();
            console.log("LEAD SAVED:", {
                country: lead.country,
                city: lead.city,
                latitude: lead.latitude,
                longitude: lead.longitude
            });
        }

        if (lead) {

            const views = await LeadActivity.countDocuments({
                visitorId,
                activityType: "VIEW_PROPERTY"
            });

            console.log("Property views:", views);

            await syncLeadToOdoo(visitorId);

        }

        res.status(201).json({
            success: true,
            message: "Property view tracked"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const trackWhatsAppClick = async (req, res) => {
    try {

        const { visitorId } = req.body;

        await LeadActivity.create({
            visitorId,
            activityType: "WHATSAPP_CLICK",
            details: "WhatsApp button clicked"
        });

        const lead = await Lead.findOne({ visitorId });

        if (lead) {

            await syncLeadToOdoo(visitorId);
        }

        res.status(201).json({
            success: true,
            message: "WhatsApp click tracked"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

const trackPropertyTime = async (req, res) => {
    try {

        const {
            visitorId,
            propertyId,
            timeSpentSeconds
        } = req.body;


        if (!timeSpentSeconds || timeSpentSeconds < 5) {
            return res.status(200).json({
                success: true
            });
        }

        console.log("PROPERTY TIME:", {
            visitorId,
            propertyId,
            timeSpentSeconds
        });

        await LeadActivity.create({
            visitorId,
            propertyId,
            activityType: "PROPERTY_TIME",
            timeSpentSeconds,
            details: `${timeSpentSeconds} seconds spent on property`
        });

        const lead = await Lead.findOne({ visitorId });

        if (lead) {

            console.log("SYNCING ODOO AFTER PROPERTY TIME");

            await syncLeadToOdoo(visitorId);
        }

        res.status(201).json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const trackServiceTime = async (req, res) => {
    try {

        const {
            visitorId,
            serviceName,
            timeSpentSeconds
        } = req.body;

        if (!timeSpentSeconds || timeSpentSeconds < 5) {
            return res.status(200).json({
                success: true
            });
        }

        console.log("SERVICE TIME:", {
            visitorId,
            serviceName,
            timeSpentSeconds
        });

        await LeadActivity.create({
            visitorId,
            activityType: "SERVICE_TIME",
            timeSpentSeconds,
            details: serviceName
        });

        const lead = await Lead.findOne({ visitorId });

        if (lead) {

            console.log("SYNCING ODOO AFTER SERVICE TIME");

            await syncLeadToOdoo(visitorId);
        }

        res.status(201).json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    trackPropertyView,
    trackWhatsAppClick,
    trackPropertyTime,
    trackServiceTime,
    syncLeadToOdoo
};