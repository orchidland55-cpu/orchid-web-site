const mongoose = require('mongoose');
const { Resend } = require('resend');
const Lead = require('../models/Lead');
const Contact = require("../models/Contact");
const LeadActivity = require("../models/LeadActivity");
const Property = require("../models/Property");

const { createOdooLead } = require("../services/odooService");

const {
  sendTelegramNotification
} = require("../services/telegramService");

const {
  sendLeadNotificationEmail,
  sendVisitRequestEmail
} = require("../services/emailService");


const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// POST /contact — Enregistre le contact ET envoie un email via Resend
// ─────────────────────────────────────────────────────────────────────────────
const addContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      propertyType,
      visitorId,
      meetingType,
      date,
      timeSlot,
      message
    } = req.body;

    // 1️⃣ Enregistrer le contact dans MongoDB
    const contact = await mongoose.connection.db.collection('contacts').insertOne({
      name, email, phone, subject, message, propertyType,
      status: "new",
      date: new Date()
    });

    // Lead Scoring Logic
    let score = 0;

    if (phone && phone.trim() !== "") score += 20;
    if (propertyType && propertyType.trim() !== "") score += 15;
    if (subject && subject.trim() !== "") score += 10;
    if (message && message.length > 30) score += 10;

    // Determine category
    let category = "Cold";

    if (score >= 40) {
      category = "Warm";
    }

    if (score >= 70) {
      category = "Hot";
    }

    console.log("=== LEAD DEBUG ===");
    console.log("Contact ID:", contact.insertedId);
    console.log("Score:", score);
    console.log("Category:", category);

    try {

      const latestActivity = await LeadActivity
        .findOne({
          visitorId,
          latitude: { $exists: true, $ne: null },
          longitude: { $exists: true, $ne: null }
        })
        .sort({ createdAt: -1 });

      console.log("LATEST ACTIVITY:", latestActivity);

      console.log("LOCATION FOUND:", {
        country: latestActivity?.country,
        city: latestActivity?.city,
        latitude: latestActivity?.latitude,
        longitude: latestActivity?.longitude
      });

      console.log("LATEST ACTIVITY:", latestActivity);
      console.log("LOCATION FOUND:", {
        country: latestActivity?.country,
        city: latestActivity?.city,
        latitude: latestActivity?.latitude,
        longitude: latestActivity?.longitude
      });
      const lead = await Lead.create({
        contactId: contact.insertedId,
        visitorId,

        country: latestActivity?.country || "",
        city: latestActivity?.city || "",
        latitude: latestActivity?.latitude || null,
        longitude: latestActivity?.longitude || null,

        leadScore: score,
        leadCategory: category
      });

      await LeadActivity.create({
        leadId: lead._id,
        visitorId,
        activityType: "CONTACT_FORM",
        details: "Lead created through contact form"
      });

      console.log("=== LEAD CREATED ===");
      console.log(lead);


      try {

        const propertyViews = await LeadActivity.countDocuments({
          visitorId,
          activityType: "VIEW_PROPERTY"
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

        const serviceViewCounts = {};
        const serviceTimeTotals = {};

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

        console.log("SERVICES LIST:");
        console.log(servicesList);

        console.log("SERVICES LIST:");
        console.log(servicesList);

        const propertyTimeActivities = await LeadActivity.find({
          visitorId,
          activityType: "PROPERTY_TIME"
        }).select("propertyId timeSpentSeconds");

        const propertyIds = viewedActivities.map(
          activity => activity.propertyId
        );

        const properties = await Property.find({
          _id: { $in: propertyIds }
        }).select("title");

        const whatsappPropertyList = properties
          .map(p => `• ${p.title}`)
          .join(" ; ");

        const propertyViewCounts = {};
        const propertyTimeTotals = {};

        viewedActivities.forEach(activity => {

          if (!activity.propertyId) return;

          const id = activity.propertyId.toString();

          propertyViewCounts[id] =
            (propertyViewCounts[id] || 0) + 1;

          propertyTimeTotals[id] =
            (propertyTimeTotals[id] || 0) +
            (activity.timeSpentSeconds || 0);
        });

        propertyTimeActivities.forEach(activity => {
          const id = activity.propertyId.toString();

          propertyTimeTotals[id] =
            (propertyTimeTotals[id] || 0) +
            (activity.timeSpentSeconds || 0);
        });

        const odooPropertyList = properties
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

        const scheduleVisits = await LeadActivity.countDocuments({
          visitorId,
          activityType: "SCHEDULE_VISIT"
        });

        const whatsappClicks = await LeadActivity.countDocuments({
          visitorId,
          activityType: "WHATSAPP_CLICK"
        });

        score += Math.min(propertyViews * 5, 25);
        score += whatsappClicks * 10;
        score += scheduleVisits * 25;

        category = "Cold";

        if (score >= 40) {
          category = "Warm";
        }

        if (score >= 80) {
          category = "Hot";
        }

        await Lead.findByIdAndUpdate(lead._id, {
          leadScore: score,
          leadCategory: category
        });

        await createOdooLead({
          name,
          email,
          phone,
          subject,
          message,

          country: latestActivity?.country || "",
          city: latestActivity?.city || "",
          latitude: latestActivity?.latitude || null,
          longitude: latestActivity?.longitude || null,

          leadScore: score,
          visitorId,
          propertyViews,
          scheduleVisits,
          whatsappClicks,
          propertyList: odooPropertyList,
          servicesList
        });

        console.log("✅ Lead sent to Odoo");
        await sendTelegramNotification(`
🏝 <b>ORCHID ISLAND</b>

━━━━━━━━━━━━━━━━━━━━━━

🔔 <b>NEW LEAD RECEIVED</b>

👤 <b>Customer</b>

• Name: ${name}
• Email: ${email}
• Phone: ${phone || "N/A"}

• Lead Score: ${score}

• Subject: ${subject || "N/A"}

• Message:
${message || "No message provided"}

━━━━━━━━━━━━━━━━━━━━━━

📍 <b>Location</b>

• Country: ${latestActivity?.country || "Unknown"}
• City: ${latestActivity?.city || "Unknown"}

📌 <a href="https://maps.google.com/?q=${latestActivity?.latitude},${latestActivity?.longitude}">Open in Google Maps</a>

━━━━━━━━━━━━━━━━━━━━━━

🏢 <b>Services Viewed</b>

${servicesList || "None"}

━━━━━━━━━━━━━━━━━━━━━━

🏠 <b>Properties Viewed</b>

${odooPropertyList || "None"}

━━━━━━━━━━━━━━━━━━━━━━

💬 <b>Engagement</b>

• WhatsApp Clicks: ${whatsappClicks}
• Property Views: ${propertyViews}
• Scheduled Visits: ${scheduleVisits}

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Generated</b>

${new Date().toLocaleString()}
`);

        await sendLeadNotificationEmail({

          name,
          email,
          phone,

          subject,
          message,

          leadScore: score,

          country: latestActivity?.country,
          city: latestActivity?.city,

          latitude: latestActivity?.latitude,
          longitude: latestActivity?.longitude,

          servicesList,

          propertyList: odooPropertyList,

          propertyViews,

          whatsappClicks,

          scheduleVisits

        });

      } catch (odooError) {
        console.error("❌ Odoo sync failed:", odooError.message);
      }

    } catch (err) {
      console.log("=== LEAD ERROR ===");
      console.error(err);
    }

    // 2️⃣ Envoyer l'email de notification via Resend
    const receivedAt = new Date();
    const dateStr = receivedAt.toLocaleDateString('fr-FR');
    const timeStr = receivedAt.toLocaleTimeString('fr-FR');

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Orchid Island <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL || 'orchido651@gmail.com',
        subject: `🏠 Nouvelle demande de contact : ${subject || 'Sans objet'}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Nouvelle demande de contact</title>
          </head>
          <body style="margin:0;padding:0;background:#f4f4f4;font-family:Georgia,serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0"
                    style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                      <td style="background:#0d2340;padding:32px 40px;text-align:center;">
                        <p style="margin:0;color:#b8972e;font-size:22px;letter-spacing:2px;text-transform:uppercase;">
                          Orchid Island
                        </p>
                        <p style="margin:8px 0 0;color:#ffffff;font-size:14px;opacity:0.7;">
                          Nouvelle demande de contact
                        </p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">

                        <!-- Infos contact -->
                        <table width="100%" cellpadding="0" cellspacing="0"
                          style="background:#f8f9fa;border-radius:8px;padding:24px;margin-bottom:24px;">
                          <tr>
                            <td>
                              <p style="margin:0 0 16px;color:#0d2340;font-size:16px;font-weight:bold;">
                                👤 Informations du contact
                              </p>
                              <p style="margin:0 0 8px;color:#555;font-size:14px;">
                                <strong>Nom :</strong> ${name}
                              </p>
                              <p style="margin:0 0 8px;color:#555;font-size:14px;">
                                <strong>Email :</strong>
                                <a href="mailto:${email}" style="color:#b8972e;">${email}</a>
                              </p>
                              <p style="margin:0 0 8px;color:#555;font-size:14px;">
                                <strong>Téléphone :</strong> ${phone || 'Non précisé'}
                              </p>
                              <p style="margin:0;color:#555;font-size:14px;">
                                <strong>Type de propriété :</strong> ${propertyType || 'Non précisé'}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- Sujet -->
                        <p style="margin:0 0 8px;color:#0d2340;font-size:15px;font-weight:bold;">
                          📌 Sujet
                        </p>
                        <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">
                          ${subject || 'Sans objet'}
                        </p>

                        <!-- Message -->
                        <p style="margin:0 0 8px;color:#0d2340;font-size:15px;font-weight:bold;">
                          💬 Message
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0"
                          style="border-left:4px solid #b8972e;padding-left:16px;margin-bottom:32px;">
                          <tr>
                            <td style="padding-left:16px;">
                              <p style="margin:0;color:#555;font-size:14px;line-height:1.8;white-space:pre-wrap;">
                                ${message}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- CTA -->
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;">
                          <tr>
                            <td style="background:#0d2340;border-radius:6px;padding:12px 28px;">
                              <a href="mailto:${email}"
                                style="color:#b8972e;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;">
                                Répondre au client
                              </a>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
                        <p style="margin:0;color:#aaa;font-size:12px;">
                          📅 Reçu le ${dateStr} à ${timeStr}
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `
Nouvelle demande de contact — Orchid Island

Nom : ${name}
Email : ${email}
Téléphone : ${phone || 'Non précisé'}
Type de propriété : ${propertyType || 'Non précisé'}

Sujet : ${subject || 'Sans objet'}

Message :
${message}

Reçu le ${dateStr} à ${timeStr}
        `.trim(),
      });

      console.log('✅ Email de contact envoyé via Resend');

      res.status(201).json({
        message: "Contact enregistré et email envoyé avec succès !",
        contactId: contact.insertedId,
      });

    } catch (emailError) {
      // La donnée est sauvegardée, mais l'email a échoué — on log et on répond quand même 201
      console.error('⚠️ Resend — échec de l\'envoi de l\'email de contact :', emailError.message);

      res.status(201).json({
        message: "Contact enregistré avec succès. (Email temporairement indisponible)",
        contactId: contact.insertedId,
        emailStatus: "pending",
        note: "Votre message a été reçu et sauvegardé. Nous vous répondrons bientôt."
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans addContact :', error);
    res.status(500).json({
      error: "Erreur serveur, réessayez plus tard.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /contacts — Récupère tous les contacts (admin)
// ─────────────────────────────────────────────────────────────────────────────
const getAllContacts = async (req, res) => {
  try {
    const contacts = await mongoose.connection.db.collection('contacts').find({})
      .sort({ date: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('❌ Erreur dans getAllContacts :', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des contacts",
      details: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /contacts/:id/status — Met à jour le statut d'un contact
// ─────────────────────────────────────────────────────────────────────────────
const updateContactStatus = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['new', 'répondu', 'planifier'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide. Utilisez : new, répondu, ou planifier'
      });
    }

    const result = await mongoose.connection.db.collection('contacts').updateOne(
      { _id: new mongoose.Types.ObjectId(contactId) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Contact non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: `Statut mis à jour vers "${status}"`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('❌ Erreur dans updateContactStatus :', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du statut",
      details: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /contacts/:id — Supprime un contact
// ─────────────────────────────────────────────────────────────────────────────
const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    const result = await mongoose.connection.db.collection('contacts').deleteOne({
      _id: new mongoose.Types.ObjectId(contactId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Contact non trouvé' });
    }

    res.status(200).json({ success: true, message: 'Contact supprimé avec succès' });
  } catch (error) {
    console.error('❌ Erreur dans deleteContact :', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression du contact",
      details: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /test-email — Test Resend
// ─────────────────────────────────────────────────────────────────────────────
const testEmail = async (req, res) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Orchid Island <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'orchido651@gmail.com',
      subject: "🧪 Test d'envoi d'email — Orchid Island",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0d2340;">🧪 Test Resend réussi !</h2>
          <p>La configuration Resend fonctionne correctement.</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
      `,
      text: `Test Resend réussi ! Date: ${new Date().toLocaleString('fr-FR')}`
    });

    res.status(200).json({
      message: "Email de test envoyé avec succès via Resend !",
      emailId: data.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur test email Resend :', error);
    res.status(500).json({ error: "Échec du test d'email", details: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /schedule-visit — Planification de visite (Nodemailer Gmail)
// ─────────────────────────────────────────────────────────────────────────────
const scheduleVisit = async (req, res) => {
  try {
    const { name, email, phone, meetingType, date, timeSlot, message, visitorId } = req.body;
    const visitDetails = `
Date: ${date}
Time: ${timeSlot}
Type: ${meetingType}
Name: ${name}
Phone: ${phone}
Email: ${email}
Message: ${message || "No message"}
`;

    console.log('📅 Nouvelle demande de planification de visite:', {
      name,
      email,
      meetingType,
      date,
      timeSlot,
      message
    });

    // Find lead associated with visitor
    let lead = await Lead.findOne({ visitorId });

    const leadAlreadyExists = !!lead;

    console.log("=== SCHEDULE DEBUG ===");
    console.log("visitorId received:", visitorId);
    console.log("lead found:", lead ? lead._id : "NOT FOUND");


    if (lead) {

      // Create activity
      await LeadActivity.create({
        leadId: lead._id,
        visitorId,
        activityType: "SCHEDULE_VISIT",
        details: `Visit requested for ${date} at ${timeSlot}`
      });
      const propertyViews = await LeadActivity.countDocuments({
        visitorId,
        activityType: "VIEW_PROPERTY"
      });

      const whatsappClicks = await LeadActivity.countDocuments({
        visitorId,
        activityType: "WHATSAPP_CLICK"
      });

      const viewedActivities = await LeadActivity.find({
        visitorId,
        activityType: "VIEW_PROPERTY"
      }).select("propertyId timeSpentSeconds");

      const propertyTimeActivities = await LeadActivity.find({
        visitorId,
        activityType: "PROPERTY_TIME"
      }).select("propertyId timeSpentSeconds");

      const propertyViewCounts = {};
      const propertyTimeTotals = {};

      viewedActivities.forEach(activity => {

        if (!activity.propertyId) return;

        const id = activity.propertyId.toString();

        propertyViewCounts[id] =
          (propertyViewCounts[id] || 0) + 1;

      });

      propertyTimeActivities.forEach(activity => {

        if (!activity.propertyId) return;

        const id = activity.propertyId.toString();

        propertyTimeTotals[id] =
          (propertyTimeTotals[id] || 0) +
          (activity.timeSpentSeconds || 0);
      });

      propertyTimeActivities.forEach(activity => {
        const id = activity.propertyId.toString();

        propertyTimeTotals[id] =
          (propertyTimeTotals[id] || 0) +
          (activity.timeSpentSeconds || 0);
      });

      const propertyIds = viewedActivities.map(
        activity => activity.propertyId
      );

      const properties = await Property.find({
        _id: { $in: propertyIds }
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

      const scheduleVisits = await LeadActivity.countDocuments({
        visitorId,
        activityType: "SCHEDULE_VISIT"
      });
      // Increase score
      if (leadAlreadyExists) {
        lead.leadScore += 40;
      }

      if (lead.leadScore >= 70) {
        lead.leadCategory = "Hot";
      } else if (lead.leadScore >= 40) {
        lead.leadCategory = "Warm";
      }

      await lead.save();

      console.log("SCHEDULE ODOO LOCATION:", {
        country: lead.country,
        city: lead.city,
        latitude: lead.latitude,
        longitude: lead.longitude
      });

      const contactRecord = await mongoose.connection.db
        .collection("contacts")
        .findOne({
          _id: lead.contactId
        });
      const serviceViews = await LeadActivity.find({
        visitorId,
        activityType: "SERVICE_VIEW"
      });

      const serviceTimes = await LeadActivity.find({
        visitorId,
        activityType: "SERVICE_TIME"
      });

      const serviceViewCounts = {};
      const serviceTimeTotals = {};

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

      await createOdooLead({
        name,
        email,
        phone,
        subject: contactRecord?.subject || "Visit Request",
        message,

        country: lead.country,
        city: lead.city,
        latitude: lead.latitude,
        longitude: lead.longitude,

        leadScore: lead.leadScore,
        visitorId,
        propertyViews,
        whatsappClicks,
        propertyList,
        servicesList,
        scheduleVisits,
        visitDetails
      });

      console.log("📈 Lead score updated:", lead.leadScore);
      await sendVisitRequestEmail({

        name,
        email,
        phone,
        message,

        meetingType,
        date,
        timeSlot,

        country: lead.country,
        city: lead.city,

        latitude: lead.latitude,
        longitude: lead.longitude,

        propertyViews,
        whatsappClicks,
        scheduleVisits,

        servicesList,
        propertyList
      });
      await sendTelegramNotification(`
🏝 <b>ORCHID ISLAND</b>

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>NEW VISIT REQUEST</b>

👤 <b>Customer</b>

• Name: ${name}
• Email: ${email}
• Phone: ${phone || "N/A"}

• Message:
${message || "No message provided"}

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Visit Details</b>

• Meeting Type: ${meetingType}
• Requested Date: ${date}
• Requested Time: ${timeSlot}

━━━━━━━━━━━━━━━━━━━━━━

📍 <b>Location</b>

• Country: ${lead.country || "Unknown"}
• City: ${lead.city || "Unknown"}

📌 <a href="https://maps.google.com/?q=${lead.latitude},${lead.longitude}">Open in Google Maps</a>

━━━━━━━━━━━━━━━━━━━━━━

🏢 <b>Services Viewed</b>

${servicesList || "None"}

━━━━━━━━━━━━━━━━━━━━━━

🏠 <b>Properties Viewed</b>

${propertyList || "None"}

━━━━━━━━━━━━━━━━━━━━━━

📊 <b>Current Engagement</b>

• Property Views: ${propertyViews}
• WhatsApp Clicks: ${whatsappClicks}
• Scheduled Visits: ${scheduleVisits}

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Generated</b>

${new Date().toLocaleString()}
`);
    }

    else {

      console.log("No lead found. Creating visit directly in Odoo...");

      const propertyViews = await LeadActivity.countDocuments({
        visitorId,
        activityType: "VIEW_PROPERTY"
      });

      const whatsappClicks = await LeadActivity.countDocuments({
        visitorId,
        activityType: "WHATSAPP_CLICK"
      });

      const scheduleVisits = 1;

      const viewedActivities = await LeadActivity.find({
        visitorId,
        activityType: "VIEW_PROPERTY"
      }).select("propertyId timeSpentSeconds");

      const propertyTimeActivities = await LeadActivity.find({
        visitorId,
        activityType: "PROPERTY_TIME"
      }).select("propertyId timeSpentSeconds");

      const propertyViewCounts = {};
      const propertyTimeTotals = {};

      viewedActivities.forEach(activity => {

        if (!activity.propertyId) return;

        const id = activity.propertyId.toString();

        propertyViewCounts[id] =
          (propertyViewCounts[id] || 0) + 1;

      });

      propertyTimeActivities.forEach(activity => {

        if (!activity.propertyId) return;

        const id = activity.propertyId.toString();

        propertyTimeTotals[id] =
          (propertyTimeTotals[id] || 0) +
          (activity.timeSpentSeconds || 0);

      });

      const propertyIds = viewedActivities.map(
        activity => activity.propertyId
      );

      const properties = await Property.find({
        _id: { $in: propertyIds }
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

      const serviceViews = await LeadActivity.find({
        visitorId,
        activityType: "SERVICE_VIEW"
      });

      const serviceTimes = await LeadActivity.find({
        visitorId,
        activityType: "SERVICE_TIME"
      });

      const serviceViewCounts = {};
      const serviceTimeTotals = {};

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

      const latestActivity = await LeadActivity.findOne({

        visitorId,

        latitude: { $ne: null }

      }).sort({ createdAt: -1 });

      console.log("LATEST ACTIVITY FOUND:", latestActivity);

      const country = latestActivity?.country || "";
      const city = latestActivity?.city || "";
      const latitude = latestActivity?.latitude || null;
      const longitude = latestActivity?.longitude || null;

      console.log("Visit location:", {
        country,
        city,
        latitude,
        longitude
      });

      await createOdooLead({

        name,
        email,
        phone,

        subject: `Visit Request - ${meetingType}`,

        message,

        visitorId,

        country,
        city,
        latitude,
        longitude,

        leadScore: 40,

        propertyViews,
        whatsappClicks,

        propertyList,
        servicesList,

        scheduleVisits,

        visitDetails

      });

      console.log("✅ Visit request sent to Odoo");

      await sendVisitRequestEmail({

        name,
        email,
        phone,
        message,

        meetingType,
        date,
        timeSlot,

        country,
        city,

        latitude,
        longitude,

        propertyViews,
        whatsappClicks,
        scheduleVisits,

        servicesList,
        propertyList

      });

      await sendTelegramNotification(`
🏝 <b>ORCHID ISLAND</b>

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>NEW VISIT REQUEST</b>

👤 <b>Customer</b>

• Name: ${name}
• Email: ${email}
• Phone: ${phone || "N/A"}

• Message:
${message || "No message provided"}

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Visit Details</b>

• Meeting Type: ${meetingType}
• Requested Date: ${date}
• Requested Time: ${timeSlot}

━━━━━━━━━━━━━━━━━━━━━━

📍 <b>Location</b>

• Country: ${country || "Unknown"}
• City: ${city || "Unknown"}

${latitude && longitude
          ? `📌 <a href="https://maps.google.com/?q=${latitude},${longitude}">Open in Google Maps</a>`
          : ""}

━━━━━━━━━━━━━━━━━━━━━━

🏢 <b>Services Viewed</b>

${servicesList || "None"}

━━━━━━━━━━━━━━━━━━━━━━

🏠 <b>Properties Viewed</b>

${propertyList || "None"}

━━━━━━━━━━━━━━━━━━━━━━

📊 <b>Current Engagement</b>

• Property Views: ${propertyViews}
• WhatsApp Clicks: ${whatsappClicks}
• Scheduled Visits: ${scheduleVisits}

━━━━━━━━━━━━━━━━━━━━━━

📅 <b>Generated</b>

${new Date().toLocaleString()}
`);

      console.log("✅ Visit request notifications sent");

    }

    // Configurer Nodemailer - Mailtrap (Gmail temporairement bloqué)
    /*const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io", 
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "91be55e01c3ccf",
        pass: process.env.MAILTRAP_PASS || "123456789orchidorchid"
      },
    });*/


    return res.status(200).json({
      success: true,
      message: "Demande de visite envoyée avec succès !"
    });

  } catch (error) {
    console.error("❌ Erreur dans scheduleVisit:", error);

    return res.status(500).json({
      success: false,
      error: "Erreur lors du traitement de la demande de visite",
      details: error.message
    });
  }

};

module.exports = {
  addContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  testEmail,
  scheduleVisit
};