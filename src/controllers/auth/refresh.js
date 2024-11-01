const { ctrlWrapper } = require("../../helpers");
const { refreshUser } = require("../../services/userService.js");

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { user, tokens } = await refreshUser(refreshToken);

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
  refresh: ctrlWrapper(refresh),
};
