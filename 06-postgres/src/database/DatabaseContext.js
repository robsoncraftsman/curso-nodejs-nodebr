class DatabaseContext {
  constructor(strategy) {
    this._strategy = strategy;
  }

  create(item) {
    this._strategy.create(item);
  }

  read(item) {
    this._strategy.read(item);
  }

  update(id, item) {
    this._strategy.update(id, item);
  }

  delete(id) {
    this._strategy.delete(id);
  }
}

module.exports = DatabaseContext;
