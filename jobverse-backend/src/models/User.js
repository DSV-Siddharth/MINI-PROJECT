const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // store hashed passwords!
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
