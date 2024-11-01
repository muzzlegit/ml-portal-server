const express = require("express");

const router = express.Router();

const {
  register,
  login,
  // logout,
  // getCurrent,
} = require("../../controllers/auth");

const { validateBody, authenticate } = require("../../middlewares");

const { userSchemas } = require("../../models");

router.post("/register", validateBody(userSchemas.registerSchema), register);

router.post("/login", validateBody(userSchemas.loginSchema), login);

// router.post("/logout", authenticate, logout);

// router.get("/current", authenticate, getCurrent);

module.exports = router;
