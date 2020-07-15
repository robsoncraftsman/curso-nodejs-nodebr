const DbStrategy = require("./DbStrategy");
const Sequelize = require("sequelize");

class PostgresStrategy extends DbStrategy {
  constructor() {
    super();
    this._sequelize = this._createSequelize();
    this._model = this._defineModel();
  }

  _createSequelize() {
    return new Sequelize("herois", "admin", "pwd", {
      host: "localhost",
      dialect: "postgres",
      quoteIdentifiers: false,
      define: {
        freezeTableName: true,
        timestamps: false,
      },
    });
  }

  _defineModel() {
    return this._sequelize.define(
      "herois",
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        nome: {
          type: Sequelize.STRING,
          required: true,
        },
        poder: {
          type: Sequelize.STRING,
          required: true,
        },
      },
      {
        tableName: "TB_HEROIS",
      }
    );
  }

  async _connect() {
    await this._sequelize.authenticate();
    return true;
  }

  async _close() {
    await this._sequelize.close();
    return true;
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

  async clear() {
    return await this._model.destroy({ where: {} });
  }
}

module.exports = PostgresStrategy;
