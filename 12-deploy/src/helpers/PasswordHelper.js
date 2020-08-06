const bcrypt = require("bcrypt");

class PasswordHelper {
  static hashPassword(password) {
    return bcrypt.hash(password, Number.parseInt(process.env.SALT_ROUNDS));
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = PasswordHelper;
