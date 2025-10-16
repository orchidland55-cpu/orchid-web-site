const nodemailer = require("nodemailer");
require("dotenv").config();

const sendInvestmentEmail = async (req, res) => {
  const { fullName, email, phone, investmentService, message } = req.body;

  // Vérifie que tous les champs obligatoires sont présents
  if (!fullName || !email || !phone || !investmentService) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
  }

  try {
    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,           // Utilise GMAIL_USER
        pass: process.env.GMAIL_APP_PASSWORD    // Utilise GMAIL_APP_PASSWORD
      }
    });

    // Options de l'email
    const mailOptions = {
      from: `"Orchid Island" <${process.env.GMAIL_USER}>`,
      replyTo: email,
      to: process.env.ADMIN_EMAIL,             // Destinataire principal
      subject: `Nouvelle demande d'investissement - ${fullName}`,
      html: `
        <h2>Nouvelle demande d'investissement</h2>
        <p><strong>Nom complet:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Service d'investissement:</strong> ${investmentService}</p>
        <p><strong>Message:</strong> ${message || "Aucun message"}</p>
      `
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email envoyé avec succès !" });

  } catch (err) {
    console.error("❌ Erreur Nodemailer:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { sendInvestmentEmail };
