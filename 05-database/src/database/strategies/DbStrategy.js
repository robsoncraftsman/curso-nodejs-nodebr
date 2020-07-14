const MethodNotImplementedError = require("../../MethodNotImplementedError");

class DbStrategy {
  constructor() {}

  create(item) {
    throw new MethodNotImplementedError();
  }

  retrieve(id) {
    throw new MethodNotImplementedError();
  }

  update(id, item) {
    throw new MethodNotImplementedError();
  }

  delete(id) {
    throw new MethodNotImplementedError();
  }
}

module.exports = DbStrategy;