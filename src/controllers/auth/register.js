const bcrypt = require("bcrypt");
// const { nanoid } = require("nanoid");
require("dotenv").config();

const { ctrlWrapper } = require("../../helpers");
const { registerUser } = require("../../services/userService.js");

const register = async (req, res) => {
  const { email, password, userColor } = req.body;

  const { user, refreshToken } = await registerUser(email, password, userColor);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(201).json({
    user: {
      email: user.email,
      createdAt: user.createdAt,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
};
