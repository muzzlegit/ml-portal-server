const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;

  const token = await AuthService.logout(refreshToken);
  res.clearCookie("refreshToken");

  res.status(200).json(token);
};

module.exports = {
  logout: ctrlWrapper(logout),
};
