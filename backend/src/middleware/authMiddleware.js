const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401);
    return next(new Error("Not authenticated"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401);
    next(new Error("Invalid/expired token"));
  }
}

module.exports = { requireAuth };