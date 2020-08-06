class BaseRoutes {
  static routes() {
    return Object.getOwnPropertyNames(this.prototype).filter(
      (propertyName) =>
        propertyName !== "constructor" && !propertyName.startsWith("_")
    );
  }
}

module.exports = BaseRoutes;
