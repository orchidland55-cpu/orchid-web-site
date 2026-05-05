require('dotenv').config();
const nodemailer = require('nodemailer');

// ── Transporter ───────────────────────────────────────────────────────────────

// Basculer entre Gmail (prod) et Mailtrap (dev) selon NODE_ENV
const isProduction = process.env.NODE_ENV === 'production';
console.log("ENV:", {
  NODE_ENV: process.env.NODE_ENV,
  MAILTRAP_USER: process.env.MAILTRAP_USER,
  MAILTRAP_PASS: process.env.MAILTRAP_PASS,
  GMAIL_USER: process.env.GMAIL_USER,
});
const transporter = nodemailer.createTransport(
  isProduction
    ? {
        // ── PRODUCTION : Gmail ──
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      }
    : {
        // ── DÉVELOPPEMENT : Mailtrap ──
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      }
);

// ── Template : invitation à définir le mot de passe ──────────────────────────

/**
 * Envoie un email d'invitation à un nouvel utilisateur.
 * @param {string} to      - Email du destinataire
 * @param {string} name    - Nom du destinataire
 * @param {string} token   - Token de réinitialisation (non hashé)
 */
async function sendSetPasswordEmail(to, name, token) {
  const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Bienvenue sur Orchid Island</title>
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
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 16px;color:#0d2340;font-size:18px;font-weight:bold;">
                    Bonjour ${name},
                  </p>
                  <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.6;">
                    Un compte vous a été créé sur l'espace d'administration <strong>Orchid Island</strong>.
                  </p>
                  <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                    Cliquez sur le bouton ci-dessous pour définir votre mot de passe et accéder à votre compte.
                    <strong>Ce lien est valable 24 heures.</strong>
                  </p>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                    <tr>
                      <td style="background:#b8972e;border-radius:6px;padding:14px 32px;">
                        <a href="${link}"
                          style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;letter-spacing:1px;">
                          Définir mon mot de passe
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px;color:#888;font-size:13px;">
                    Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
                  </p>
                  <p style="margin:0;word-break:break-all;">
                    <a href="${link}" style="color:#b8972e;font-size:13px;">${link}</a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #eee;text-align:center;">
                  <p style="margin:0;color:#aaa;font-size:12px;">
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL || '"Orchid Island" <no-reply@orchidisland.com>',
    to,
    subject: 'Bienvenue — Définissez votre mot de passe',
    html,
  });
}

module.exports = { sendSetPasswordEmail };