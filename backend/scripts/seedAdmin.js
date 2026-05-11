// scripts/seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Charger le .env depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const existingAdmin = await User.findOne({ 
      email: process.env.ADMIN_EMAIL.toLowerCase() 
    });

    if (existingAdmin) {
      console.log('✅ Admin déjà existant :', existingAdmin.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: "Perry_Dev",
      email: "orchidland55@gmail.com",
      role: 'admin',
      passwordSet: false

    });

    console.log('✅ Admin créé avec succès :', admin.email);
    process.exit(0);

  } catch (err) {
    console.error('❌ Erreur seedAdmin:', err);
    process.exit(1);
  }
};

seedAdmin();