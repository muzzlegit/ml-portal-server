const { ctrlWrapper } = require("../../helpers");
const { AuthService } = require("../../services");

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const isSent = await AuthService.requestPasswordReset(email);
  console.log("isSent", isSent);

  res.json({});
};

module.exports = {
  requestPasswordReset: ctrlWrapper(requestPasswordReset),
};
