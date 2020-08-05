const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

class PasswordHelper {
  static hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = PasswordHelper;
