const MongoDbStrategy = require("./src/database/strategies/mongodb/MongoDbStrategy");
const api = require("./src/api/api");

MongoDbStrategy.connect("mongodb://user:pwd@localhost:27217/herois");
api.startServer();
