const mongoose = require("mongoose");

const DbStrategy = require("./DbStrategy");

class MongoDbStrategy extends DbStrategy {
  constructor() {
    super();
    this._model = this._defineModel();
  }

  _defineModel() {
    const schema = new mongoose.Schema({
      nome: {
        type: String,
        required: true,
      },
      poder: {
        type: String,
        required: true,
      },
    });

    return mongoose.model("herois", schema);
  }

  async _connect() {
    await mongoose.connect("mongodb://user:pwd@localhost:27217/herois", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return true;
  }

  async _close() {
    await mongoose.connection.close();
    return true;
  }

  async _clear() {
    await this._model.deleteMany({});
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
}

module.exports = MongoDbStrategy;
