const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  summary: String,
  experience: [{
    title: String,
    company: String,
    duration: String,
    achievements: [String]
  }],
  skills: [String],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  certifications: [String],
}, { timestamps: true });

module.exports = mongoose.model("Resume", ResumeSchema);
