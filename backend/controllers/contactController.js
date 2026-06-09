const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// POST /contact — Enregistre le contact ET envoie un email via Resend
// ─────────────────────────────────────────────────────────────────────────────
const addContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, propertyType } = req.body;

    // 1️⃣ Enregistrer le contact dans MongoDB
    const contact = await mongoose.connection.db.collection('contacts').insertOne({
      name, email, phone, subject, message, propertyType,
      status: "new",
      date: new Date()
    });

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
    const { name, email, phone, meetingType, date, timeSlot, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
      from: '"Orchid Real Estate" <noreply@orchid-realestate.com>',
      to: process.env.ADMIN_EMAIL || "orchido651@gmail.com",
      subject: `📅 Nouvelle demande de visite : ${meetingType || "Consultation"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#4F46E5;border-bottom:2px solid #4F46E5;padding-bottom:10px;">
            📅 Nouvelle demande de planification de visite
          </h2>
          <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#333;margin-top:0;">👤 Informations du client</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Téléphone :</strong> ${phone || "Non précisé"}</p>
          </div>
          <div style="background:#e3f2fd;padding:20px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#333;margin-top:0;">📅 Détails du rendez-vous</h3>
            <p><strong>Type :</strong> ${meetingType || "Non précisé"}</p>
            <p><strong>Date souhaitée :</strong> ${date ? new Date(date).toLocaleDateString('fr-FR') : "Non précisée"}</p>
            <p><strong>Heure souhaitée :</strong> ${timeSlot || "Non précisée"}</p>
          </div>
          ${message ? `
          <div style="background:#fff3e0;padding:20px;border-radius:8px;margin:20px 0;">
            <h3 style="color:#333;margin-top:0;">💬 Message</h3>
            <p style="white-space:pre-wrap;">${message}</p>
          </div>` : ''}
          <p style="color:#666;font-size:12px;text-align:center;">
            📅 Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
          </p>
        </div>
      `,
      text: `
Demande de visite\n\nNom : ${name}\nEmail : ${email}\nTéléphone : ${phone || "Non précisé"}\nType : ${meetingType || "Non précisé"}\nDate : ${date ? new Date(date).toLocaleDateString('fr-FR') : "Non précisée"}\nHeure : ${timeSlot || "Non précisée"}${message ? `\n\nMessage :\n${message}` : ''}
      `.trim(),
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(200).json({
        success: true,
        message: "Demande de visite envoyée avec succès !",
        emailId: info.messageId
      });
    } catch (emailError) {
      console.error('⚠️ Email de planification non envoyé :', emailError.message);
      res.status(200).json({
        success: true,
        message: "Demande de visite reçue ! Nous vous confirmerons bientôt.",
        emailStatus: "pending"
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans scheduleVisit :', error);
    res.status(500).json({
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