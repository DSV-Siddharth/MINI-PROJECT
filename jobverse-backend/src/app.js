const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({origin: ["http://localhost:8080","http://localhost:3000"]}));


app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));
// ...existing code above

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));

// Add this new route:
app.post('/api/interview-coach', async (req, res) => {
  const { messages } = req.body;
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  let reply = "That's interesting! Can you tell me more about your experience with teamwork or a challenging project?";
  if (lastUserMessage.toLowerCase().includes('data structure')) {
    reply = "Great, can you explain how a hash map works or how you'd use it in a project?";
  } else if (lastUserMessage.toLowerCase().includes('conflict')) {
    reply = "Conflict resolution is very important. Can you describe a time you resolved a conflict in a team?";
  }

  res.json({
    message: reply
  });
});
app.post('/api/analyze-resume', async (req, res) => {
  const { resumeText } = req.body;
  // Basic check: If resumeText is missing, return error
  if (!resumeText) {
    return res.status(400).json({ error: "Missing resumeText" });
  }

  // Mock response for successful analysis (replace with real logic as needed)
  res.json({
    score: 75, // Example score
    strengths: [
      "Clear work experience",
      "Good technical skills",
      "Structured format"
    ],
    improvements: [
      "Add more quantifiable achievements",
      "Include relevant certifications",
      "Use active language"
    ]
  });
});


module.exports = app;


