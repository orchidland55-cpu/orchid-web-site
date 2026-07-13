const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true },
  contractType: { type: String, required: true },
  deadline: { type: Date },
  salary: { type: String },
  duration: { type: String },
  stageType: { type: String },
  freelanceDeadline: { type: Date },
  status: { type: String, default: "active" }, // active, closed
  person: { type: String },
}, { timestamps: true });

module.exports = mongoose.models.Career || mongoose.model('Career', careerSchema);