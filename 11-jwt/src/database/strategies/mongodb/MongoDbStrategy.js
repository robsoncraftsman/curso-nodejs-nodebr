const DbStrategy = require("../DbStrategy");

class MongoDbStrategy extends DbStrategy {
  constructor(model) {
    super();
    this._model = model;
  }

  async create(item) {
    return await this._model.create(item);
  }

  async read(item, skip, limit) {
    return await this._model.find(item).skip(skip).limit(limit).lean();
  }

  async update(id, item) {
    return await this._model.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    return await this._model.deleteOne({ _id: id });
  }

  async clear() {
    await this._model.deleteMany({});
  }
}

module.exports = MongoDbStrategy;
