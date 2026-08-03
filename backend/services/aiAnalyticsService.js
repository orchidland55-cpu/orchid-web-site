const fs = require("fs");
const path = require("path");

const LeadActivity = require("../models/LeadActivity");
const Property = require("../models/Property");

const trafficScores = [];
const propertyClusters = new Map();

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, "utf8").trim();

    const lines = content.split(/\r?\n/);

    const headers = lines[0]
        .split(",")
        .map(h => h.trim());

    return lines.slice(1).map(line => {

        const values = line.split(",");

        const obj = {};

        headers.forEach((header, index) => {
            obj[header] = (values[index] || "").trim();
        });

        return obj;
    });
}

function loadAnalyticsFiles() {

    try {

        console.log("process.cwd():", process.cwd());
        console.log("__dirname:", __dirname);

        const trafficFile = path.join(
            __dirname,
            "../orchid-analytics/data/results/traffic_engagement_scores.csv"
        );

        const clusterFile = path.join(
            __dirname,
            "../orchid-analytics/data/results/property_clusters.csv"
        );

        console.log("Traffic file:", trafficFile);
        console.log("Traffic exists:", fs.existsSync(trafficFile));

        console.log("Cluster file:", clusterFile);
        console.log("Cluster exists:", fs.existsSync(clusterFile));

        if (fs.existsSync(trafficFile)) {

            const rows = parseCSV(trafficFile);

            trafficScores.length = 0;

            trafficScores.push(...rows);
        }

        if (fs.existsSync(clusterFile)) {

            const rows = parseCSV(clusterFile);

            propertyClusters.clear();

            rows.forEach(row => {

                propertyClusters.set(
                    row.pageTitle.trim().toLowerCase(),
                    row.Cluster_Name
                );

            });

        }

        console.log("Traffic scores:", trafficScores.length);
        console.log("Property clusters:", propertyClusters.size);
        console.log("✅ AI analytics loaded.");

    }
    catch (err) {

        console.error("AI Analytics loading failed:", err);

    }

}

loadAnalyticsFiles();

async function getLeadAIAnalytics(visitorId) {

    if (!visitorId) {

        return {
            aiTrafficSource: "",
            aiTrafficScore: 0,
            aiHighPages: "",
            aiMediumPages: "",
            aiLowPages: ""
        };

    }

    const activities = await LeadActivity
        .find({ visitorId })
        .sort({ createdAt: -1 });

    let trafficSource = "";
    let trafficMedium = "";

    for (const activity of activities) {

        if (activity.trafficSource) {

            trafficSource = activity.trafficSource;

            trafficMedium = activity.trafficMedium;

            break;

        }

    }

    let aiTrafficScore = 0;

    const trafficRow = trafficScores.find(row =>

        row.sessionSource === trafficSource &&
        row.sessionMedium === trafficMedium

    );

    if (trafficRow) {

        aiTrafficScore =
            Number(trafficRow.AI_Engagement_Score) || 0;

    }

    const propertyActivities =
        activities.filter(a => a.propertyId);

    const uniquePropertyIds =
        [...new Set(

            propertyActivities.map(a =>
                a.propertyId.toString()
            )

        )];

    const properties = await Property.find({
        _id: { $in: uniquePropertyIds }
    });

    const high = [];
    const medium = [];
    const low = [];

    properties.forEach(property => {

        const title =
            (property.title || "").trim();

        const cluster =
            propertyClusters.get(
                title.toLowerCase()
            );

        if (!cluster)
            return;

        if (cluster === "Highly Engaging Pages") {

            high.push(title);

        }
        else if (cluster === "Popular Pages") {

            medium.push(title);

        }
        else {

            low.push(title);

        }

    });

    return {

        aiTrafficSource:
            trafficSource && trafficMedium
                ? `${trafficSource} / ${trafficMedium}`
                : "",

        aiTrafficScore,

        aiHighPages:
            high.join("\n"),

        aiMediumPages:
            medium.join("\n"),

        aiLowPages:
            low.join("\n")

    };

}

module.exports = {
    getLeadAIAnalytics
};