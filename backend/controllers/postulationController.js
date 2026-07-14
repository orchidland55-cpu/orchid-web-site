const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// POST /postulations — Envoie la candidature (CV + lettre de motivation) via Resend
// ─────────────────────────────────────────────────────────────────────────────
const sendPostulation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, position, experience, motivation } = req.body;

    const cvFile = req.files?.cv;
    const coverLetterFile = req.files?.coverLetter; // optionnel, comme dans le formulaire

    console.log('req.files:', req.files);
    console.log('cvFile:', cvFile?.name);
    console.log('coverLetterFile:', coverLetterFile?.name);

    // ✅ Seul le CV est obligatoire — conforme au formulaire frontend
    if (!cvFile) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez joindre votre CV.'
      });
    }

    const receivedAt = new Date();
    const dateStr = receivedAt.toLocaleDateString('fr-FR');
    const timeStr = receivedAt.toLocaleTimeString('fr-FR');

    // ✅ Construction des pièces jointes pour Resend
    const attachments = [
      { filename: cvFile.name, content: cvFile.data }
    ];
    if (coverLetterFile) {
      attachments.push({ filename: coverLetterFile.name, content: coverLetterFile.data });
    }

    try {
      const data = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Orchid Island <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL || 'orchido651@gmail.com',
        subject: `📄 Nouvelle candidature de ${firstName} ${lastName} — ${position || 'Poste non précisé'}`,
        html: `
          <!DOCTYPE html>
          <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Nouvelle candidature</title>
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
                          Nouvelle candidature reçue
                        </p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">

                        <!-- Infos candidat -->
                        <table width="100%" cellpadding="0" cellspacing="0"
                          style="background:#f8f9fa;border-radius:8px;padding:24px;margin-bottom:24px;">
                          <tr>
                            <td>
                              <p style="margin:0 0 16px;color:#0d2340;font-size:16px;font-weight:bold;">
                                👤 Informations du candidat
                              </p>
                              <p style="margin:0 0 8px;color:#555;font-size:14px;">
                                <strong>Nom :</strong> ${firstName} ${lastName}
                              </p>
                              <p style="margin:0 0 8px;color:#555;font-size:14px;">
                                <strong>Email :</strong>
                                <a href="mailto:${email}" style="color:#b8972e;">${email}</a>
                              </p>
                              <p style="margin:0 0 8px;color:#555;font-size:14px;">
                                <strong>Téléphone :</strong> ${phone || 'Non précisé'}
                              </p>
                              <p style="margin:0;color:#555;font-size:14px;">
                                <strong>Adresse :</strong> ${address || 'Non renseignée'}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- Poste -->
                        <p style="margin:0 0 8px;color:#0d2340;font-size:15px;font-weight:bold;">
                          💼 Poste souhaité
                        </p>
                        <p style="margin:0 0 24px;color:#555;font-size:14px;line-height:1.6;">
                          ${position || 'Non précisé'}
                        </p>

                        <!-- Expérience -->
                        <p style="margin:0 0 8px;color:#0d2340;font-size:15px;font-weight:bold;">
                          🧳 Expérience
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0"
                          style="border-left:4px solid #b8972e;margin-bottom:24px;">
                          <tr>
                            <td style="padding-left:16px;">
                              <p style="margin:0;color:#555;font-size:14px;line-height:1.8;white-space:pre-wrap;">
                                ${experience || 'Non renseignée'}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- Motivation -->
                        <p style="margin:0 0 8px;color:#0d2340;font-size:15px;font-weight:bold;">
                          💬 Motivation
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0"
                          style="border-left:4px solid #b8972e;margin-bottom:32px;">
                          <tr>
                            <td style="padding-left:16px;">
                              <p style="margin:0;color:#555;font-size:14px;line-height:1.8;white-space:pre-wrap;">
                                ${motivation || 'Non renseignée'}
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- Pièces jointes -->
                        <p style="margin:0 0 8px;color:#0d2340;font-size:15px;font-weight:bold;">
                          📎 Documents joints
                        </p>
                        <p style="margin:0 0 24px;color:#555;font-size:14px;">
                          CV : ${cvFile.name}${coverLetterFile ? `<br/>Lettre de motivation : ${coverLetterFile.name}` : ''}
                        </p>

                        <!-- CTA -->
                        <table cellpadding="0" cellspacing="0" style="margin:0 auto 8px;">
                          <tr>
                            <td style="background:#0d2340;border-radius:6px;padding:12px 28px;">
                              <a href="mailto:${email}"
                                style="color:#b8972e;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;">
                                Répondre au candidat
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
Nouvelle candidature — Orchid Island

Nom : ${firstName} ${lastName}
Email : ${email}
Téléphone : ${phone || 'Non précisé'}
Adresse : ${address || 'Non renseignée'}

Poste souhaité : ${position || 'Non précisé'}

Expérience :
${experience || 'Non renseignée'}

Motivation :
${motivation || 'Non renseignée'}

Documents joints :
CV : ${cvFile.name}
${coverLetterFile ? `Lettre de motivation : ${coverLetterFile.name}` : ''}

Reçu le ${dateStr} à ${timeStr}
        `.trim(),
        attachments,
      });

      console.log('✅ Email de candidature envoyé via Resend, id:', data.id);

      return res.status(200).json({
        success: true,
        message: 'Candidature envoyée avec succès par email !'
      });

    } catch (emailError) {
      console.error('❌ Erreur Resend — échec de l\'envoi de l\'email de candidature :', emailError.message);
      return res.status(500).json({
        success: false,
        message: "Votre candidature n'a pas pu être envoyée. Veuillez réessayer.",
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans sendPostulation:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = { sendPostulation };