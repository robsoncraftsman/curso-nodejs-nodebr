const MethodNotImplementedError = require("../../MethodNotImplementedError");

class DbStrategy {
  constructor() {}

  async create(item) {
    throw new MethodNotImplementedError();
  }

  async read(item) {
    throw new MethodNotImplementedError();
  }

  async update(id, item) {
    throw new MethodNotImplementedError();
  }

  async delete(id) {
    throw new MethodNotImplementedError();
  }
}

module.exports = DbStrategy;
