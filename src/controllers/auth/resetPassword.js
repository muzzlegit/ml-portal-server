const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const resetPassword = async (req, res) => {
  const { user, tokens } = await AuthService.refreshUser(refreshToken);

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
  resetPassword: ctrlWrapper(resetPassword),
};
