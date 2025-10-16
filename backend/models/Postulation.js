const mongoose = require("mongoose");

const PostulationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  motivation: { type: String, required: true },
  cv: { type: String, required: true }, // chemin du fichier
  coverLetter: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Postulation", PostulationSchema);
