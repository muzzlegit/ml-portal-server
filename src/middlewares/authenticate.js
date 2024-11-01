const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
const { validateToken } = require("../services/tokenService.js");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (token === "" || bearer !== "Bearer") {
    next(HttpError(401));
  }

  try {
    const { valid, user, error } = await validateToken(token, "access");

    if (!valid) {
      next(HttpError(401, error));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
