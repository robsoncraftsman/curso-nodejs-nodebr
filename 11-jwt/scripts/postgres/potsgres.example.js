const Sequelize = require("sequelize");

const sequelize = new Sequelize("herois", "admin", "pwd", {
  host: "localhost",
  dialect: "postgres",
  quoteIdentifiers: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

(async () => {
  const herois = sequelize.define(
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

  const ironman = await herois.create({
    id: 1,
    nome: "Ironman",
    poder: "Tech",
  });

  const todosHerois = await herois.findAll({
    raw: true,
    attributes: ["nome", "poder", "id"],
  });

  console.log("Heróis cadastrados: ", todosHerois);

  await sequelize.close();
})();
