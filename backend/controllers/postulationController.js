const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

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

    // ✅ On répond immédiatement au client — l'utilisateur n'attend pas l'envoi SMTP,
    // qui peut prendre plusieurs secondes (négociation Gmail + pièce jointe).
    res.status(200).json({
      success: true,
      message: 'Candidature envoyée avec succès par email !'
    });

    // ✅ Utilise cvFile.data (buffer mémoire) au lieu de tempFilePath,
    // qui n'existe pas sans l'option useTempFiles sur express-fileupload
    const attachments = [
      { filename: cvFile.name, content: cvFile.data }
    ];
    if (coverLetterFile) {
      attachments.push({ filename: coverLetterFile.name, content: coverLetterFile.data });
    }

    const mailOptions = {
      from: `"Orchid Island" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'orchido651@gmail.com',
      subject: `📄 Nouvelle candidature de ${firstName} ${lastName}`,
      html: `
        <h2>Nouvelle candidature</h2>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Adresse:</strong> ${address || "Non renseignée"}</p>
        <p><strong>Poste souhaité:</strong> ${position}</p>
        <p><strong>Expérience:</strong><br/>${experience}</p>
        <p><strong>Motivation:</strong><br/>${motivation}</p>
      `,
      attachments
    };

    // ✅ Envoi en arrière-plan, ne bloque plus la réponse au client.
    // En cas d'échec, l'email n'est pas envoyé mais l'utilisateur a déjà reçu
    // une confirmation — surveillez les logs serveur pour repérer les échecs SMTP
    // (quota Gmail dépassé, mot de passe app invalide, etc.)
    transporter.sendMail(mailOptions)
      .then(() => {
        console.log(`✅ Email de candidature envoyé pour ${firstName} ${lastName}`);
      })
      .catch((error) => {
        console.error('❌ Erreur envoi email candidature (arrière-plan):', error);
      });

  } catch (error) {
    console.error('❌ Erreur dans sendPostulation:', error);
    // On ne peut répondre avec une erreur que si la réponse n'a pas déjà été envoyée
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = { sendPostulation };