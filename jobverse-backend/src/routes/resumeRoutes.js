const express = require("express");
const router = express.Router();
const axios = require("axios");
const resumeController = require("../controllers/resumeController");

// CRUD endpoints
router.post("/", resumeController.createResume);
router.get("/", resumeController.getResumes);

// AI resume generator endpoint
router.post("/generate", resumeController.generateResumeAI);

// Healthcheck for API key
router.get("/test-api-key", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Say hello!" },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );
    res.json({
      status: "API key working!",
      result: response.data.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "API key failed or unauthorized", detail: err.message });
  }
});

module.exports = router;
