const express = require("express");

const router = express.Router();

const {
  register,
  login,
  // logout,
  refresh,
} = require("../../controllers/auth");

const { validateBody, authenticate } = require("../../middlewares");

const { userSchemas } = require("../../models");

router.post("/register", validateBody(userSchemas.registerSchema), register);

router.post("/login", validateBody(userSchemas.loginSchema), login);

// router.post("/logout", authenticate, logout);

router.get("/refresh", authenticate, refresh);

module.exports = router;
