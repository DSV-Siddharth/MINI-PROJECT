// server.js (place this at the root of your backend project)
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas using the connection string in your .env
connectDB();
app.get("/", (req, res) => {
  res.send("Job-Verse Backend is running...");
});

// Start the Express backend server
app.listen(PORT, () => {
  console.log(`Job-Verse backend server is running on http://localhost:${PORT}`);
});
