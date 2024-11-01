const { User } = require("../models");
const { generateToken, saveToken } = require("../services/tokenService.js");
const { createRegisterUserDTO } = require("../dtos");
const { HttpError } = require("../helpers");
const bcrypt = require("bcrypt");

const registerUser = async (email, password, userColor) => {
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashPassword,
    userColor,
  });
  console.log("DTO", createRegisterUserDTO);

  const userDTO = createRegisterUserDTO(newUser);
  const { accessToken, refreshToken } = generateToken(userDTO);

  await saveToken(userDTO.id, refreshToken);

  return { user: userDTO, accessToken, refreshToken };
};

module.exports = {
  registerUser,
};
