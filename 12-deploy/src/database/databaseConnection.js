const mongoose = require("mongoose");
const Sequelize = require("sequelize");

function createSequelize(url) {
  return new Sequelize(url, {
    dialect: "postgres",
    quoteIdentifiers: false,
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false,
    },
  });
}

const sequelize = createSequelize(process.env.URL_POSTGRES);

async function sequelizeConnect() {
  await sequelize.authenticate();
}

async function sequelizeDisconnect() {
  await sequelize.close();
}

async function mongooseConnect(url) {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return true;
}

async function mongooseDisconnect() {
  await mongoose.connection.close();
}

async function connectToDatabase() {
  await mongooseConnect(process.env.URL_MONGODB);
  await sequelizeConnect();
}

async function disconnectToDatabase() {
  mongooseDisconnect();
  sequelizeDisconnect();
}

module.exports = { connectToDatabase, disconnectToDatabase, sequelize };
