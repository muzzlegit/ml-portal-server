const express = require("express");

const router = express.Router();

const { updateTheme, updateUser } = require("../../controllers/user");

const { validateBody, upload, authenticate } = require("../../middlewares");

const { userSchemas } = require("../../models");

router.patch(
  "/theme",
  authenticate,
  validateBody(userSchemas.themeSchema),
  updateTheme
);

router.patch(
  "/",
  authenticate,
  upload.single("avatar"),
  validateBody(userSchemas.updateSchema),
  updateUser
);

module.exports = router;
