const bcrypt = require("bcrypt");

class HashService {
  constructor(salt = 10) {
    this.salt = salt;
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, this.salt);
  }

  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = new HashService();
