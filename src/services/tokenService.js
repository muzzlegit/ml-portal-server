const jwt = require("jsonwebtoken");
const { Token } = require("../models");

const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
    expiresIn: "12h",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

module.exports = {
  generateToken,
  saveToken,
};
