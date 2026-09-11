const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { swaggerMiddleware, swaggerSpec } = require("./docs/swagger");


const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true
}));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/api/docs.json", (req, res) => res.json(swaggerSpec));
app.use("/api/docs", ...swaggerMiddleware);

app.use(notFound);
app.use(errorHandler);
const limiter = new RateLimiterMemory({ points: 50, duration: 60 }); // 50 req/min per IP

app.use(async (req, res, next) => {
  try {
    await limiter.consume(req.ip);
    next();
  } catch {
    res.status(429);
    next(new Error("Too many requests"));
  }
});

module.exports = app;