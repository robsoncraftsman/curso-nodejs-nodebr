class DatabaseContext {
  constructor(strategy) {
    this._strategy = strategy;
  }

  async create(item) {
    return this._strategy.create(item);
  }

  async read(item, skip = 0, limit = 10) {
    return this._strategy.read(item, skip, limit);
  }

  async update(id, item) {
    return this._strategy.update(id, item);
  }

  async delete(id) {
    return this._strategy.delete(id);
  }

  async clear() {
    return this._strategy.clear();
  }
}

module.exports = DatabaseContext;
