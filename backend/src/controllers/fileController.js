const multer = require("multer");
const streamifier = require("streamifier");
const { cloudinary } = require("../config/cloudinary");
const MediaFile = require("../models/MediaFile");

// Multer in-memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

function allowed(mime) {
  return [
    "application/pdf",
    "image/png", "image/jpeg", "image/webp", "image/gif",
    "video/mp4", "video/webm", "video/quicktime",
    "audio/mpeg", "audio/wav", "audio/mp4", "audio/aac", "audio/ogg"
  ].includes(mime);
}

function resourceTypeFor(mime) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "video"; // Cloudinary treats audio via resource_type=video
  return "raw"; // pdf, etc.
}

exports.multerSingle = upload.single("file");

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("File is required (field name: file)");
    }
    if (!allowed(req.file.mimetype)) {
      res.status(400);
      throw new Error("Unsupported file type");
    }

    const tagsRaw = req.body.tags || "";
    const tags = tagsRaw
    .split(",")
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20);

    const resourceType = resourceTypeFor(req.file.mimetype);

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `media/${req.user.id}`,
          resource_type: resourceType
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const doc = await MediaFile.create({
      owner: req.user.id,
      originalName: req.file.originalname,
      tags,

      cloudinaryPublicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,

      mimeType: req.file.mimetype,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,

      viewCount: 0
    });

    res.status(201).json({ file: doc });
  } catch (e) { next(e); }
};

exports.getFileById = async (req, res, next) => {
  try {
    const file = await MediaFile.findOne({ _id: req.params.id, owner: req.user.id });
    if (!file) {
      res.status(404);
      throw new Error("File not found");
    }

    file.viewCount += 1;
    await file.save();

    res.json({ file });
  } catch (e) { next(e); }
};