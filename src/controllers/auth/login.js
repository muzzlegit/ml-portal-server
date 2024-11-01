const { ctrlWrapper } = require("../../helpers");
const { loginUser } = require("../../services/userService.js");

const login = async (req, res) => {
  const { email, password } = req.body;

  const { user, tokens } = await loginUser(email, password);

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.json({
    user,
    tokens,
  });
};

module.exports = {
  login: ctrlWrapper(login),
};
