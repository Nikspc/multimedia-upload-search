const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" }
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  const secure = String(process.env.COOKIE_SECURE) === "true";
  const sameSite = secure ? "none" : "lax";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 15 * 60 * 1000                  //15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure,
    sameSite,
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000         //7 days
  });
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409);
      throw new Error("Email already in use");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    setAuthCookies(res, { accessToken, refreshToken });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401);
      throw new Error("Invalid credentials");
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    setAuthCookies(res, { accessToken, refreshToken });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("_id name email");
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
};

exports.refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      res.status(401);
      throw new Error("Missing refresh token");
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      res.status(401);
      throw new Error("Invalid refresh token");
    }

    // rotation check
    if (hashToken(token) !== user.refreshTokenHash) {
      res.status(401);
      throw new Error("Refresh token reuse detected");
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    setAuthCookies(res, { accessToken, refreshToken });
    res.json({ ok: true });
  } catch (e) { next(e); }
};

exports.logout = async (req, res, next) => {
  try {
    // best effort invalidate refresh token
    const token = req.cookies.refreshToken;
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
      } catch {}
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    res.json({ ok: true });
  } catch (e) { next(e); }
};