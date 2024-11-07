const { v4: uuidv4 } = require("uuid");

class IDService {
  static generateID() {
    return uuidv4();
  }
}

module.exports = IDService;
