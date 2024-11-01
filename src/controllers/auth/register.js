const { ctrlWrapper } = require("../../helpers");
const { registerUser } = require("../../services/userService.js");

const register = async (req, res) => {
  const { email, password, userColor, userIcon } = req.body;

  const { user, tokens } = await registerUser(
    email,
    password,
    userColor,
    userIcon
  );

  res.cookie("refreshToken", tokens.refreshToken, {
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
