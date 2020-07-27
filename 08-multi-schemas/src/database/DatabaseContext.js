class DatabaseContext {
  constructor(strategy) {
    this._strategy = strategy;
  }

  create(item) {
    return this._strategy.create(item);
  }

  read(id) {
    return this._strategy.read(id);
  }

  update(id, item) {
    return this._strategy.update(id, item);
  }

  delete(id) {
    return this._strategy.delete(id);
  }

  clear() {
    return this._strategy.clear();
  }
}

module.exports = DatabaseContext;
