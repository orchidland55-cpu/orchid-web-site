const axios = require("axios");

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_API_KEY = process.env.ODOO_API_KEY;

async function testOdooConnection() {
    try {

        const response = await axios.post(
            `${ODOO_URL}/jsonrpc`,
            {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    service: "common",
                    method: "authenticate",
                    args: [
                        ODOO_DB,
                        ODOO_USERNAME,
                        ODOO_API_KEY,
                        {}
                    ]
                },
                id: Date.now()
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Odoo auth response:", response.data);

        return response.data.result;
    } catch (error) {
        console.error("Odoo connection error:", error.response?.data || error.message);
        throw error;
    }
}


async function createOdooLead({
    name,
    email,
    phone,
    subject = "",
    message = "",

    country = "",
    city = "",
    latitude = null,
    longitude = null,

    leadScore,
    visitorId,
    propertyViews = 0,
    scheduleVisits = 0,
    visitDetails = "",
    whatsappClicks = 0,
    propertyList = "",
    servicesList = ""
}) {

    console.log("ODOO LOCATION:", {
        country,
        city,
        latitude,
        longitude
    });

    // Prevent updating the wrong Odoo lead
    if (!visitorId) {
        console.warn("⚠️ No visitorId received. A new Odoo lead will be created.");
    }

    const mapUrl =
        latitude && longitude
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : "";

    const uid = await testOdooConnection();
    const searchResponse = await axios.post(
        `${ODOO_URL}/jsonrpc`,
        {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    ODOO_DB,
                    uid,
                    ODOO_API_KEY,
                    "crm.lead",
                    "search",
                    [[["x_visitor_id", "=", visitorId]]]
                ]
            },
            id: Date.now()
        },
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    const existingLeadIds = searchResponse.data.result || [];

    let existingVisitDetails = "";

    if (existingLeadIds.length > 0) {

        const readResponse = await axios.post(
            `${ODOO_URL}/jsonrpc`,
            {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    service: "object",
                    method: "execute_kw",
                    args: [
                        ODOO_DB,
                        uid,
                        ODOO_API_KEY,
                        "crm.lead",
                        "read",
                        [
                            existingLeadIds,
                            ["x_visit_request_details"]
                        ]
                    ]
                },
                id: Date.now()
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        existingVisitDetails =
            readResponse.data.result?.[0]?.x_visit_request_details || "";
    }

    console.log("Existing Odoo Leads:", existingLeadIds);

    const note = "[Source: Website]";
    console.log(note);
    let response;

    if (existingLeadIds.length > 0) {

        console.log("Updating existing Odoo lead...");
        let updatedVisitDetails = existingVisitDetails;

        if (visitDetails && visitDetails.trim()) {
            updatedVisitDetails = existingVisitDetails
                ? existingVisitDetails +
                "\n\n--------------------------------\n\n" +
                visitDetails
                : visitDetails;
        }
        response = await axios.post(
            `${ODOO_URL}/jsonrpc`,
            {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    service: "object",
                    method: "execute_kw",
                    args: [
                        ODOO_DB,
                        uid,
                        ODOO_API_KEY,
                        "crm.lead",
                        "write",
                        [
                            existingLeadIds,
                            {
                                description: note,

                                email_from: email,
                                phone: phone,
                                contact_name: name,

                                ...(subject ? { x_subject: subject } : {}),

                                x_visitor_id: visitorId,

                                x_contact_message: message || "",

                                x_lead_score: leadScore,
                                x_property_views: propertyViews,
                                x_schedule_visits: scheduleVisits,
                                x_visit_request_details: updatedVisitDetails,
                                x_whatsapp_clicks: whatsappClicks,
                                x_viewed_properties: propertyList,
                                x_viewed_services: servicesList,
                                x_country: country,
                                x_city: city,
                                x_latitude: latitude,
                                x_longitude: longitude,
                                x_google_maps_url: mapUrl
                            }
                        ]
                    ]
                },
                id: Date.now()
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    } else {

        console.log("Creating new Odoo lead...");

        response = await axios.post(
            `${ODOO_URL}/jsonrpc`,
            {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    service: "object",
                    method: "execute_kw",
                    args: [
                        ODOO_DB,
                        uid,
                        ODOO_API_KEY,
                        "crm.lead",
                        "create",
                        [{
                            name: `Website Lead - ${name}`,
                            contact_name: name,
                            email_from: email,
                            phone: phone,
                            x_subject: subject,

                            x_visitor_id: visitorId,

                            x_contact_message: message || "",

                            x_lead_score: leadScore,
                            x_property_views: propertyViews,
                            x_schedule_visits: scheduleVisits,
                            x_visit_request_details: visitDetails,
                            x_whatsapp_clicks: whatsappClicks,
                            x_viewed_properties: propertyList,
                            x_viewed_services: servicesList,
                            x_country: country,
                            x_city: city,
                            x_latitude: latitude,
                            x_longitude: longitude,
                            x_google_maps_url: mapUrl,

                            description: note
                        }]
                    ]
                },
                id: Date.now()
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

    }

    return response.data;
}

module.exports = {
    testOdooConnection,
    createOdooLead
};