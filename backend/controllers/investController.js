const nodemailer = require("nodemailer");
const axios = require("axios");
const validator = require("validator");
require("dotenv").config();

// Fonction pour nettoyer les entrées utilisateur (anti XSS)
const clean = (value) => validator.escape(value || "");

const sendInvestmentEmail = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    investmentService,
    message,
    recaptchaToken
  } = req.body;

  // Vérification des champs obligatoires
  if (!fullName || !email || !phone || !investmentService) {
    return res.status(400).json({ error: "Veuillez remplir tous les champs obligatoires." });
  }

  // Validation email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email invalide." });
  }

  // Vérification longueur minimale
  if (fullName.length < 3) {
    return res.status(400).json({ error: "Nom trop court." });
  }

  // Vérification reCAPTCHA
  if (!recaptchaToken) {
    return res.status(400).json({ error: "Veuillez valider le reCAPTCHA." });
  }

  try {
    // ✅ Vérification du token avec Google
    const recaptchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken
        },
        timeout: 5000
      }
    );

    const { success, score } = recaptchaResponse.data;

    // Vérification stricte
    if (!success || (score !== undefined && score < 0.5)) {
      return res.status(400).json({ error: "reCAPTCHA invalide ou suspect." });
    }

    // ✅ Configuration Nodemailer (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Nettoyage des données
    const safeFullName = clean(fullName);
    const safeEmail = clean(email);
    const safePhone = clean(phone);
    const safeService = clean(investmentService);
    const safeMessage = clean(message || "Aucun message");

    // Email
    const mailOptions = {
      from: `"Orchid Island" <${process.env.GMAIL_USER}>`,
      replyTo: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle demande d'investissement - ${safeFullName}`,
      html: `
        <h2>Nouvelle demande d'investissement</h2>
        <p><strong>Nom complet:</strong> ${safeFullName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Téléphone:</strong> ${safePhone}</p>
        <p><strong>Service d'investissement:</strong> ${safeService}</p>
        <p><strong>Message:</strong> ${safeMessage}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Email envoyé avec succès !"
    });

  } catch (err) {
    console.error("❌ Erreur:", err);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur. Veuillez réessayer plus tard."
    });
  }
};

module.exports = { sendInvestmentEmail };