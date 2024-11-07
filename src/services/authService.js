const TokenService = require("./tokenService.js");
const HashService = require("./hashService.js");
const MailService = require("./mailService.js");
const IDService = require("./idService.js");
const { AuthDTO } = require("../dtos");
const { HttpError } = require("../helpers");
const { User } = require("../models");

class AuthService {
  constructor(hashService, tokenService, mailService, idService) {
    this.hashService = hashService;
    this.tokenService = tokenService;
    this.mailService = mailService;
    this.idService = idService;
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

  // LOGOUT
  async logout(refreshToken) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }
  // RESET PASSWORD
  async resetPassword(resetToken, newPassword) {
    if (!resetToken || !newPassword) {
      throw HttpError(400);
    }
    const { valid, user, error } = await this.tokenService.validateToken(
      resetToken,
      "reset"
    );

    if (!valid) {
      throw HttpError(401, error);
    }
    if (!user || !user.id) {
      throw HttpError(404, "User not found for the provided token.");
    }

    const hashPassword = await this.hashService.hashPassword(newPassword);

    const updatedUser = await User.findByIdAndUpdate(user?.id, {
      password: hashPassword,
    });
    if (!updatedUser) {
      throw HttpError(404);
    }
    await this.tokenService.removeTokenByUserId(user.id);
  }
  // REQUEST PASSWORD RESET
  async requestPasswordReset(email) {
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpError(404);
    }
    const userDTO = AuthDTO.toRegisterDTO(user);

    const link = this.idService.generateID();
    const resetLink = `${process.env.BASE_URL}/api/auth/reset-password/${link}`;
    this.mailService.sendPasswordResetEmail(email, resetLink);
    const resetToken = this.tokenService.generateResetToken({ id: userDTO.id });
    return { resetToken };
  }

  // REFRESH
  async refreshUser(refreshToken) {
    if (!refreshToken) {
      throw HttpError(400);
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

module.exports = new AuthService(
  HashService,
  TokenService,
  MailService,
  IDService
);
