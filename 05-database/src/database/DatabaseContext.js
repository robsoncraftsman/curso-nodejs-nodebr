class DatabaseContext {
  constructor(strategy) {
    this._strategy = strategy;
  }

  create(item) {
    return this._strategy.create(item);
  }

  read(item) {
    return this._strategy.read(item);
  }

  update(id, item) {
    return this._strategy.update(id, item);
  }

  delete(id) {
    return this._strategy.delete(id);
  }
}

module.exports = DatabaseContext;
