const mongoose = require("mongoose");
const MediaFile = require("../models/MediaFile");

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.searchFiles = async (req, res, next) => {
  try {
    const { query = "", type, sort = "relevance" } = req.query;

    const ownerId = new mongoose.Types.ObjectId(req.user.id);
    const q = query.trim();

    const match = { owner: ownerId };
    if (type) match.resourceType = type;

    const qRegex = q ? new RegExp(escapeRegex(q), "i") : null;

    const pipeline = [
      { $match: match },

      // If query provided: filter only relevant files (filename OR tags match)
      ...(qRegex
        ? [{
            $match: {
              $or: [
                { originalName: qRegex },
                { tags: qRegex } // works with array fields
              ]
            }
          }]
        : []),

      // Relevance scoring
      {
        $addFields: {
          viewScore: { $ln: { $add: ["$viewCount", 1] } },
          daysSince: {
            $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60 * 60 * 24]
          },

          nameHit: qRegex
            ? { $cond: [{ $regexMatch: { input: "$originalName", regex: qRegex } }, 1, 0] }
            : 0,

          tagHit: qRegex
            ? {
                $cond: [
                  {
                    $anyElementTrue: {
                      $map: {
                        input: "$tags",
                        as: "t",
                        in: { $regexMatch: { input: "$$t", regex: qRegex } }
                      }
                    }
                  },
                  1,
                  0
                ]
              }
            : 0
        }
      },
      {
        $addFields: {
          recencyScore: { $divide: [1, { $add: ["$daysSince", 1] }] },

          // boost filename match more than tags
          keywordScore: {
            $add: [
              { $multiply: ["$nameHit", 3] },
              { $multiply: ["$tagHit", 2] }
            ]
          },

          finalScore: {
            $add: [
              { $multiply: ["$keywordScore", 8] },
              { $multiply: ["$viewScore", 1.5] },
              { $multiply: ["$recencyScore", 3] }
            ]
          }
        }
      }
    ];

    const sortStage =
      sort === "newest" ? { createdAt: -1 } :
      sort === "views" ? { viewCount: -1 } :
      { finalScore: -1 };

    pipeline.push({ $sort: sortStage });
    pipeline.push({ $limit: 50 });

    const files = await MediaFile.aggregate(pipeline);
    res.json({ files });
  } catch (e) {
    next(e);
  }
};