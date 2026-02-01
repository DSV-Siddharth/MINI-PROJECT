const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema(
  {
    resumesCreated: { type: Number, default: 0 },
    resumeScoresChecked: { type: Number, default: 0 },
    interviewSessions: { type: Number, default: 0 },
    questionsViewed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stats", statsSchema);
