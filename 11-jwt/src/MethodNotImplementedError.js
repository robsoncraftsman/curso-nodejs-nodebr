class MethodNotImplementedError extends Error {
  constructor() {
    super("Method not implemented");
  }
}

module.exports = MethodNotImplementedError;
