const TokenService = require("./tokenService.js");
const HashService = require("./hashService.js");
const { AuthDTO } = require("../dtos");
const { HttpError } = require("../helpers");
const { User } = require("../models");

class AuthService {
  constructor(hashService, tokenService) {
    this.hashService = hashService;
    this.tokenService = tokenService;
  }
  // REGISTRATION
  async registration(email, password, userColor, userIcon) {
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409);
    }

    const hashPassword = await this.hashService.hashPassword(password);

    const newUser = await User.create({
      email,
      password: hashPassword,
      userColor,
      userIcon,
    });

    const userDTO = AuthDTO.toRegisterDTO(newUser);
    const tokens = this.tokenService.generateToken(userDTO);

    await this.tokenService.saveToken(userDTO.id, tokens?.refreshToken);

    return { user: userDTO, tokens };
  }

  // LOGIN
  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await this.hashService.comparePassword(
      password,
      user.password
    );

    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }

    const userDTO = AuthDTO.toLoginDTO(user);

    const tokens = this.tokenService.generateToken(userDTO);

    await this.tokenService.saveToken(userDTO.id, tokens?.refreshToken);

    return { user: userDTO, tokens };
  }

  // REFRESH
  async refreshUser(refreshToken) {
    if (!refreshToken) {
      throw HttpError(401);
    }
    const { valid, user, error } = await this.tokenService.validateToken(
      refreshToken,
      "refresh"
    );
    const tokenData = await this.tokenService.findToken(refreshToken);

    if (!valid || !tokenData) {
      throw HttpError(401, error);
    }

    const currentUser = await User.findById(user.id);
    const userDTO = AuthDTO.toLoginDTO(currentUser);

    const tokens = this.tokenService.generateToken(userDTO);

    await this.tokenService.saveToken(userDTO.id, tokens?.refreshToken);

    return { user: userDTO, tokens };
  }
}

module.exports = new AuthService(HashService, TokenService);
