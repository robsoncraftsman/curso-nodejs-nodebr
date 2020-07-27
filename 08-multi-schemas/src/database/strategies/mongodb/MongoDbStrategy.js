const mongoose = require("mongoose");

const DbStrategy = require("../DbStrategy");

class MongoDbStrategy extends DbStrategy {
  constructor(model) {
    super();
    this._model = model;
  }

  static async connect(url) {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return true;
  }

  static async close() {
    await mongoose.connection.close();
    return true;
  }

  async create(item) {
    return await this._model.create(item);
  }

  async read(item) {
    return await this._model.find(item).lean();
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
