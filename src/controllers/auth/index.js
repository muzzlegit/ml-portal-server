const { register } = require("./register.js");
const { login } = require("./login.js");
const { refresh } = require("./refresh.js");
const { logout } = require("./logout.js");
const { resetPassword } = require("./resetPassword.js");
const { requestPasswordReset } = require("./requestPasswordReset.js");

module.exports = {
  register,
  login,
  refresh,
  logout,
  resetPassword,
  requestPasswordReset,
};
