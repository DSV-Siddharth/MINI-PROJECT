const express = require("express");
const router = express.Router();
const Stats = require("../models/Stats");

// Get current stats (create document if missing)
router.get("/", async (req, res) => {
  try {
    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({});
    }
    res.json(stats);
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ error: "Failed to load stats" });
  }
});

// Increment a specific field
router.post("/increment", async (req, res) => {
  try {
    const { field } = req.body;
    const allowed = [
      "resumesCreated",
      "resumeScoresChecked",
      "interviewSessions",
      "questionsViewed",
    ];
    if (!allowed.includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }

    const stats = await Stats.findOneAndUpdate(
      {},
      { $inc: { [field]: 1 } },
      { new: true, upsert: true }
    );

    res.json(stats);
  } catch (err) {
    console.error("Increment stats error:", err);
    res.status(500).json({ error: "Failed to update stats" });
  }
});

module.exports = router;
