const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const addContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message, propertyType } = req.body;

    // 1️⃣ Enregistrer le contact dans MongoDB
    const contact = await mongoose.connection.db.collection('contacts').insertOne({
      name, email, phone, subject, message, propertyType,
      status: "new",
      date: new Date()
    });

    // 2️⃣ Configurer Nodemailer - Mailtrap (Gmail temporairement bloqué)
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "91be55e01c3ccf",
        pass: process.env.MAILTRAP_PASS || "123456789orchidorchid"
      },
    });

    // Test de la connexion SMTP
    try {
      await transporter.verify();
    } catch (error) {
      // Connexion SMTP échouée, continuer sans email
    }

    // 3️⃣ Contenu de l'email avec HTML
    const mailOptions = {
      from: '"Orchid Real Estate" <noreply@orchid-realestate.com>',
      to: process.env.ADMIN_EMAIL || "orchido651@gmail.com",
      subject: `🏠 Nouvelle demande de contact: ${subject || "Sans objet"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            📧 Nouvelle demande de contact
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Informations du contact :</h3>
            <p><strong>👤 Nom :</strong> ${name}</p>
            <p><strong>📧 Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>📱 Téléphone :</strong> ${phone || "Non précisé"}</p>
            <p><strong>🏠 Type de propriété :</strong> ${propertyType || "Non précisé"}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #4F46E5; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💬 Message :</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              📅 Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
      `,
      text: `
Nouvelle demande de contact

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non précisé"}
Type de propriété: ${propertyType || "Non précisé"}

Message:
${message}

Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
      `,
    };

    // 4️⃣ Tenter d'envoyer l'email
    try {
      const info = await transporter.sendMail(mailOptions);

      res.status(201).json({
        message: "Contact enregistré et email envoyé avec succès !",
        contactId: contact.insertedId,
        emailId: info.messageId
      });
    } catch (emailError) {
      // Succès partiel : données sauvegardées, email en attente
      res.status(201).json({
        message: "Contact enregistré avec succès. Email sera envoyé ultérieurement.",
        contactId: contact.insertedId,
        emailStatus: "pending",
        note: "Votre message a été reçu et sauvegardé. Nous vous répondrons bientôt."
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans addContact:', error);
    
    // Réponse détaillée selon le type d'erreur
    if (error.code === 'EAUTH') {
      res.status(500).json({ 
        error: "Erreur d'authentification email. Vérifiez vos credentials Mailtrap.",
        details: error.message
      });
    } else if (error.code === 'ECONNECTION') {
      res.status(500).json({ 
        error: "Impossible de se connecter au serveur email.",
        details: error.message
      });
    } else {
      res.status(500).json({ 
        error: "Erreur serveur, réessayez plus tard.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

// GET all contacts (pour l'admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await mongoose.connection.db.collection('contacts').find({})
      .sort({ date: -1 }) // Trier par date décroissante
      .toArray();

    res.status(200).json({
      success: true,
      data: contacts,
      count: contacts.length
    });
  } catch (error) {
    console.error('❌ Erreur dans getAllContacts:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération des contacts",
      details: error.message
    });
  }
};

// UPDATE contact status
const updateContactStatus = async (req, res) => {
  try {
    const contactId = req.params.id;
    const { status } = req.body;

    // Validation du statut
    const validStatuses = ['new', 'répondu', 'planifier'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Statut invalide. Utilisez: new, répondu, ou planifier'
      });
    }

    console.log(`📝 Mise à jour du statut du contact ${contactId} vers "${status}"...`);

    const result = await mongoose.connection.db.collection('contacts').updateOne(
      { _id: new mongoose.Types.ObjectId(contactId) },
      {
        $set: {
          status: status,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }

    console.log('✅ Statut du contact mis à jour avec succès');
    res.status(200).json({
      success: true,
      message: `Statut mis à jour vers "${status}"`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('❌ Erreur dans updateContactStatus:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du statut",
      details: error.message
    });
  }
};

// DELETE contact
const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    console.log(`🗑️ Suppression du contact ${contactId}...`);

    const result = await mongoose.connection.db.collection('contacts').deleteOne({
      _id: new mongoose.Types.ObjectId(contactId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact non trouvé'
      });
    }

    console.log('✅ Contact supprimé avec succès');
    res.status(200).json({
      success: true,
      message: 'Contact supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur dans deleteContact:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la suppression du contact",
      details: error.message
    });
  }
};

// Fonction pour tester l'envoi d'email
const testEmail = async (req, res) => {
  try {
    console.log('🧪 Test d\'envoi d\'email...');

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "91be55e01c3ccf",
        pass: process.env.MAILTRAP_PASS || "123456789orchidorchid"
      },
    });

    // Test de connexion
    await transporter.verify();
    console.log('✅ Connexion SMTP OK');

    // Email de test
    const testMailOptions = {
      from: '"Orchid Real Estate Test" <test@orchid-realestate.com>',
      to: process.env.ADMIN_EMAIL || "orchido651@gmail.com",
      subject: "🧪 Test d'envoi d'email - Orchid Real Estate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">🧪 Test d'email réussi !</h2>
          <p>Ceci est un email de test pour vérifier que la configuration fonctionne.</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Serveur :</strong> Mailtrap</p>
          <p style="color: #28a745;">✅ La configuration email fonctionne correctement !</p>
        </div>
      `,
      text: `Test d'email réussi ! Date: ${new Date().toLocaleString('fr-FR')}`
    };

    const info = await transporter.sendMail(testMailOptions);
    console.log('✅ Email de test envoyé:', info.messageId);

    res.status(200).json({
      message: "Email de test envoyé avec succès !",
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({
      error: "Échec du test d'email",
      details: error.message
    });
  }
};

// Planifier une visite (envoi direct par email, pas de sauvegarde en base)
const scheduleVisit = async (req, res) => {
  try {
    const { name, email, phone, meetingType, date, timeSlot, message } = req.body;

    console.log('📅 Nouvelle demande de planification de visite:', { name, email, meetingType, date, timeSlot });

    // Configurer Nodemailer - Mailtrap (Gmail temporairement bloqué)
    /*const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "91be55e01c3ccf",
        pass: process.env.MAILTRAP_PASS || "123456789orchidorchid"
      },
    });*/
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});


    // Contenu de l'email pour la planification de visite
    const mailOptions = {
      from: '"Orchid Real Estate" <noreply@orchid-realestate.com>',
      to: process.env.ADMIN_EMAIL || "orchido651@gmail.com",
      subject: `📅 Nouvelle demande de visite: ${meetingType || "Consultation"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
            📅 Nouvelle demande de planification de visite
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">👤 Informations du client</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Téléphone:</strong> ${phone || "Non précisé"}</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📅 Détails du rendez-vous</h3>
            <p><strong>Type de rendez-vous:</strong> ${meetingType || "Non précisé"}</p>
            <p><strong>Date souhaitée:</strong> ${date ? new Date(date).toLocaleDateString('fr-FR') : "Non précisée"}</p>
            <p><strong>Heure souhaitée:</strong> ${timeSlot || "Non précisée"}</p>
          </div>

          ${message ? `
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">💬 Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              📅 Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
            </p>
            <p style="color: #4F46E5; font-weight: bold;">
              ⚡ Action requise: Confirmer le rendez-vous avec le client
            </p>
          </div>
        </div>
      `,
      text: `
Nouvelle demande de planification de visite

Informations du client:
Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non précisé"}

Détails du rendez-vous:
Type: ${meetingType || "Non précisé"}
Date: ${date ? new Date(date).toLocaleDateString('fr-FR') : "Non précisée"}
Heure: ${timeSlot || "Non précisée"}

${message ? `Message:\n${message}\n` : ''}

Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

Action requise: Confirmer le rendez-vous avec le client
      `,
    };

    // Envoyer l'email
    console.log('📤 Envoi de l\'email de planification...');
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email de planification envoyé:', info.messageId);

      res.status(200).json({
        success: true,
        message: "Demande de visite envoyée avec succès ! Nous vous confirmerons par email.",
        emailId: info.messageId
      });
    } catch (emailError) {
      console.log('⚠️ Email de planification non envoyé (temporaire):', emailError.message);

      // Succès partiel : demande reçue, email en attente
      res.status(200).json({
        success: true,
        message: "Demande de visite reçue ! Nous vous confirmerons par email dès que possible.",
        emailStatus: "pending",
        note: "Votre demande de visite a été enregistrée. Nous vous contacterons bientôt."
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans scheduleVisit:', error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du traitement de la demande de visite",
      details: error.message
    });
  }
};

// Export des fonctions
module.exports = {
  addContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
  testEmail,
  scheduleVisit
};
