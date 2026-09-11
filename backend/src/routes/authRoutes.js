/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication
 *
 * /api/auth/register:
 *   post:
 *     summary: Register
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201: { description: Created }
 *
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 *
 * /api/auth/me:
 *   get:
 *     summary: Current user
 *     tags: [Auth]
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */

const router = require("express").Router();
const { body } = require("express-validator");
const { register, login, me, refresh, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

function validate(rules) {
  const { validationResult } = require("express-validator");
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400);
        return next(new Error(errors.array().map(e => e.msg).join(", ")));
      }
      next();
    }
  ];
}

router.post("/register",
  validate([
    body("name").isString().isLength({ min: 2 }).withMessage("Name too short"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars")
  ]),
  register
);

router.post("/login",
  validate([
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password required")
  ]),
  login
);

router.get("/me", requireAuth, me);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;