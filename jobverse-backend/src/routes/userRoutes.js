const express = require("express");
const router = express.Router();

// Placeholder route to prevent errors
router.get("/", (req, res) => {
  res.json({ message: "User API working" });
});

module.exports = router;
