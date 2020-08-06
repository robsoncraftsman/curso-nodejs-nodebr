const Sequelize = require("sequelize");

function defineModel(sequelize) {
  return sequelize.define(
    "usuarios",
    {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        required: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
    },
    {
      tableName: "TB_USUARIOS",
    }
  );
}

module.exports = defineModel;
