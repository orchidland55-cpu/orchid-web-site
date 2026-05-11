// scripts/seedTestUser.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const { sendSetPasswordEmail } = require('../services/emailService');

const seedTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const TEST_EMAIL = 'orchidland55@gmail.com'; // ← ton email Resend

    // Nettoyer si déjà existant
    await User.deleteOne({ email: TEST_EMAIL });
    console.log('🧹 Ancien utilisateur test supprimé (si existant)');

    // Créer l'utilisateur sans password
    const user = await User.create({
      name: 'Perry Test',
      email: TEST_EMAIL,
      role: 'admin',
      passwordSet: false,
    });
    console.log('✅ Utilisateur créé :', user.email);

    // Générer le token
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = rawToken;
    user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    console.log('✅ Token généré');

    // Envoyer l'email
    await sendSetPasswordEmail(user.email, user.name, rawToken);
    console.log('✅ Email envoyé à :', user.email);
    console.log('🔗 Lien :', `${process.env.FRONTEND_URL}/set-password?token=${rawToken}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err);
    process.exit(1);
  }
};

seedTestUser();