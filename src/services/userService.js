const bcrypt = require("bcrypt");

const { User } = require("../models");
const {
  generateToken,
  saveToken,
  validateToken,
  findToken,
} = require("../services/tokenService.js");
const { createRegisterUserDTO, createLoginUserDTO } = require("../dtos");
const { HttpError } = require("../helpers");

// Registration
const registerUser = async (email, password, userColor, userIcon) => {
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashPassword,
    userColor,
    userIcon,
  });

  const userDTO = createRegisterUserDTO(newUser);
  const tokens = generateToken(userDTO);

  await saveToken(userDTO.id, tokens.refreshToken);

  return { user: userDTO, tokens };
};

// Login
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const userDTO = createLoginUserDTO(user);

  const tokens = generateToken(userDTO);

  await saveToken(userDTO.id, tokens.refreshToken);

  return { user: userDTO, tokens };
};

// Refresh
const refreshUser = async (refreshToken) => {
  if (!refreshToken) {
    throw HttpError(401);
  }
  const { valid, user, error } = await validateToken(refreshToken, "refresh");
  const tokenData = await findToken(refreshToken);

  if (!valid || !tokenData) {
    throw HttpError(401, error);
  }

  const currentUser = await User.findById(user.id);
  const userDTO = createLoginUserDTO(currentUser);
  const tokens = generateToken(userDTO);
  await saveToken(userDTO.id, tokens.refreshToken);
  return { tokens, user: userDTO };
};

module.exports = {
  registerUser,
  loginUser,
  refreshUser,
};
