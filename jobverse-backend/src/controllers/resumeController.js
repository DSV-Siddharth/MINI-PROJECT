const Resume = require("../models/Resume");
const axios = require("axios");

// Create and Save Resume
exports.createResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Resumes
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate Resume using OpenRouter API
exports.generateResumeAI = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a resume assistant." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );
    res.status(200).json({ resume: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
