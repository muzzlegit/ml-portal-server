const { ctrlWrapper } = require("../../helpers");
const { loginUser } = require("../../services/userService.js");

const login = async (req, res) => {
  const { email, password } = req.body;

  const { user, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.json({
    user,
  });
};

module.exports = {
  login: ctrlWrapper(login),
};
