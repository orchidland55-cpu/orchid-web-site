const Lead = require("../models/Lead");
const LeadActivity = require("../models/LeadActivity");

const getLeadAnalytics = async (req, res) => {
    try {

        const leads = await Lead.find();

        const analytics = [];

        for (const lead of leads) {

            const views = await LeadActivity.countDocuments({
                visitorId: lead.visitorId,
                activityType: "VIEW_PROPERTY"
            });

            const visits = await LeadActivity.countDocuments({
                visitorId: lead.visitorId,
                activityType: "SCHEDULE_VISIT"
            });

            analytics.push({
                leadId: lead._id,
                visitorId: lead.visitorId,
                score: lead.leadScore,
                category: lead.leadCategory,
                propertyViews: views,
                scheduledVisits: visits
            });
        }

        res.json(analytics);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    getLeadAnalytics
};