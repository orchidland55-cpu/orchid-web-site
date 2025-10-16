const nodemailer = require('nodemailer');

const sendPostulation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, position, experience, motivation } = req.body;

    // Vérifie que les fichiers existent
    const cvFile = req.files?.cv;
    const coverLetterFile = req.files?.coverLetter;

    // Débogage
    console.log('req.files:', req.files);
    console.log('cvFile:', cvFile);
    console.log('coverLetterFile:', coverLetterFile);

    // Vérifie que les fichiers ont été envoyés
    if (!cvFile || !coverLetterFile) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez envoyer à la fois le CV et la lettre de motivation.'
      });
    }

    // Configuration de Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Email
    const mailOptions = {
      from: `"Orchid Island" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'orchido651@gmail.com',
      subject: `📄 Nouvelle candidature de ${firstName} ${lastName}`,
      html: `
        <h2>Nouvelle candidature</h2>
        <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Adresse:</strong> ${address}</p>
        <p><strong>Poste souhaité:</strong> ${position}</p>
        <p><strong>Expérience:</strong><br/>${experience}</p>
        <p><strong>Motivation:</strong><br/>${motivation}</p>
      `,
      attachments: [
        { filename: cvFile.name, path: cvFile.tempFilePath },
        { filename: coverLetterFile.name, path: coverLetterFile.tempFilePath }
      ]
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Candidature envoyée avec succès par email !'
    });

  } catch (error) {
    console.error('❌ Erreur dans sendPostulation:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { sendPostulation };
