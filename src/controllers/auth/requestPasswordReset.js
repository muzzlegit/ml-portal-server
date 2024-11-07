const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const { resetToken } = await AuthService.requestPasswordReset(email);

  res.cookie("resetToken", resetToken, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 1800000,
  });

  res.status(200).json({ message: "Message sent successfully" });
};

module.exports = {
  requestPasswordReset: ctrlWrapper(requestPasswordReset),
};
