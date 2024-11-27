const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const register = async (req, res) => {
  const { email, password, userColor, userIcon } = req.body;

  const { user, tokens } = await AuthService.registration(
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
    message: `${user.email} successfully registered`,
  });
};

module.exports = {
  register: ctrlWrapper(register),
};
