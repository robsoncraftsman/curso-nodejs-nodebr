const DbStrategy = require("../DbStrategy");
const Sequelize = require("sequelize");

class PostgresStrategy extends DbStrategy {
  constructor(sequelize, model) {
    super();
    this._sequelize = sequelize;
    this._model = model;
  }

  static createSequelize(options) {
    return new Sequelize(options.database, options.username, options.password, {
      host: options.host,
      dialect: options.dialect,
      quoteIdentifiers: false,
      logging: false,
      define: {
        freezeTableName: true,
        timestamps: false,
      },
    });
  }

  async _clear() {
    return await this._model.destroy({ where: {} });
  }

  async create(item) {
    const model = await this._model.create(item, { raw: true });
    return model.dataValues;
  }

  async read(item) {
    return await this._model.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    return await this._model.update(item, { where: { id } });
  }

  async delete(id) {
    return await this._model.destroy({ where: { id } });
  }
}

module.exports = PostgresStrategy;
