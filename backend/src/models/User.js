const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, unique: true, required: true, lowercase: true },
  passwordHash: { type: String, required: true },
  refreshTokenHash: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);