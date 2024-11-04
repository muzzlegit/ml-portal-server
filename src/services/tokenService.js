const jwt = require("jsonwebtoken");
const { Token } = require("../models");

class TokenService {
  static generateToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  };

  static saveToken = async (userId, refreshToken) => {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  };

  static findToken = async (refreshToken) => {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  };

  static validateToken = async (accessToken, keyType) => {
    const secretKey =
      keyType === "access"
        ? process.env.JWT_SECRET_ACCESS
        : process.env.JWT_SECRET_REFRESH;

    if (!secretKey) {
      return {
        valid: false,
        error: "Secret key not defined for the given key type",
      };
    }

    try {
      const userData = jwt.verify(accessToken, secretKey);
      return { valid: Boolean(userData), user: userData };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, error: "Token has expired" };
      } else if (error instanceof jwt.JsonWebTokenError) {
        return { valid: false, error: "Invalid token" };
      } else {
        return { valid: false, error: "Token verification failed" };
      }
    }
  };
}

module.exports = TokenService;
