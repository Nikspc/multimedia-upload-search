/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: Upload/Search
 *
 * /api/files/upload:
 *   post:
 *     summary: Upload file
 *     tags: [Files]
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file: { type: string, format: binary }
 *               tags: { type: string, example: "tag1,tag2" }
 *     responses:
 *       201: { description: Created }
 *
 * /api/files/search:
 *   get:
 *     summary: Search files by filename/tags
 *     tags: [Files]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [image, video, raw] }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [relevance, newest, views] }
 *     responses:
 *       200: { description: OK }
 *
 * /api/files/{id}:
 *   get:
 *     summary: Get file by id (increments viewCount)
 *     tags: [Files]
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */

const router = require("express").Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { multerSingle, uploadFile, getFileById } = require("../controllers/fileController");
const { searchFiles } = require("../controllers/searchController");

router.post("/upload", requireAuth, multerSingle, uploadFile);
router.get("/search", requireAuth, searchFiles);
router.get("/:id", requireAuth, getFileById);

module.exports = router;