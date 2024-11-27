const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  const { user, tokens } = await AuthService.refreshUser(refreshToken);

  res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.json({
    user,
    token: tokens.accessToken,
  });
};

module.exports = {
  refresh: ctrlWrapper(refresh),
};
