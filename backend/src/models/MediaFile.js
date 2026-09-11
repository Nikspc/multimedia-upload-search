const mongoose = require("mongoose");

const mediaFileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  originalName: { type: String, required: true },
  tags: { type: [String], default: [] },

  cloudinaryPublicId: { type: String, required: true },
  secureUrl: { type: String, required: true },

  mimeType: { type: String, required: true },
  resourceType: { type: String, required: true }, // image|video|raw
  format: { type: String },
  bytes: { type: Number, required: true },

  viewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for keyword search
mediaFileSchema.index({ originalName: "text", tags: "text" });

module.exports = mongoose.model("MediaFile", mediaFileSchema);