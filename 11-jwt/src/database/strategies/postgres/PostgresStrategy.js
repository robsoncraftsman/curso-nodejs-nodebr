const DbStrategy = require("../DbStrategy");

class PostgresStrategy extends DbStrategy {
  constructor(sequelize, model) {
    super();
    this._sequelize = sequelize;
    this._model = model;
  }

  async create(item) {
    const model = await this._model.create(item, { raw: true });
    return model.dataValues;
  }

  async read(item, skip, limit) {
    return await this._model.findAll({
      limit,
      offset: skip,
      where: item,
      raw: true,
    });
  }

  async update(id, item) {
    return await this._model.update(item, { where: { id } });
  }

  async delete(id) {
    return await this._model.destroy({ where: { id } });
  }

  async clear() {
    return await this._model.destroy({ where: {} });
  }
}

module.exports = PostgresStrategy;
