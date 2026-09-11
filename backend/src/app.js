const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { swaggerMiddleware, swaggerSpec } = require("./docs/swagger");

const app = express();

// 1. Security & Parsing Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.get("/health", (_, res) => res.json({ ok: true }));

// 2. Rate Limiter (Must be placed BEFORE routes)
const limiter = new RateLimiterMemory({ points: 50, duration: 60 });
app.use(async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({ message: "Too many requests, please try again later." });
  }
});

// 3. Database Connection Middleware for Vercel Serverless
app.use(async (req, res, next) => {
  try {
    await connectDB(process.env.MONGO_URI);
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/docs", ...swaggerMiddleware);

// 5. Error Handlers (Must ALWAYS be at the very bottom)
app.use(notFound);
app.use(errorHandler);

module.exports = app;