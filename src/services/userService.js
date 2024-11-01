const bcrypt = require("bcrypt");

const { User } = require("../models");
const { generateToken, saveToken } = require("../services/tokenService.js");
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
  const { accessToken, refreshToken } = generateToken(userDTO);

  await saveToken(userDTO.id, refreshToken);

  return { user: userDTO, accessToken, refreshToken };
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

  const { accessToken, refreshToken } = generateToken(userDTO);

  await saveToken(userDTO.id, refreshToken);

  return { user: userDTO, accessToken, refreshToken };
};

module.exports = {
  registerUser,
  loginUser,
};
