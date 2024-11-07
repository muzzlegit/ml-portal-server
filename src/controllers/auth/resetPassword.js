const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.cookies;
  await AuthService.resetPassword(resetToken, password);

  res.clearCookie("refreshToken");
  res.clearCookie("resetToken");

  res.status(200).json({
    message: "Password changed successfully",
  });
};

module.exports = {
  resetPassword: ctrlWrapper(resetPassword),
};
