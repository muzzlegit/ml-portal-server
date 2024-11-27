const jwt = require("jsonwebtoken");
const { Token } = require("../models");

class TokenService {
  static generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_ACCESS, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  static generateResetToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET_RESET, {
      expiresIn: 60 * 30,
    });
  }

  static async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  static async findToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  }

  static async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }
  static async removeTokenByUserId(userId) {
    const tokenData = await Token.deleteOne({ user: userId });
    return tokenData;
  }

  static async validateToken(token, keyType) {
    const keyTypes = {
      access: process.env.JWT_SECRET_ACCESS,
      refresh: process.env.JWT_SECRET_REFRESH,
      reset: process.env.JWT_SECRET_RESET,
    };
    const secretKey = keyTypes[keyType];

    if (!secretKey) {
      return {
        valid: false,
        error: "Secret key not defined for the given key type",
      };
    }

    try {
      const userData = jwt.verify(token, secretKey);
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
  }
}

module.exports = TokenService;
