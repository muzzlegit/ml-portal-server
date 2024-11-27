const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  refresh,
  resetPassword,
  requestPasswordReset,
} = require("../../controllers/auth");

const { validateBody, authenticate } = require("../../middlewares");

const { userSchemas } = require("../../models");

router.post("/register", validateBody(userSchemas.registerSchema), register);

router.post("/login", validateBody(userSchemas.loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/refresh", refresh);

router.post(
  "/request-password-reset",
  validateBody(userSchemas.requestPasswordResetSchema),
  requestPasswordReset
);

router.put(
  "/reset-password",
  validateBody(userSchemas.resetPasswordSchema),
  resetPassword
);

module.exports = router;
