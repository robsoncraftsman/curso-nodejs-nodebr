const DatabaseContext = require("./database/DatabaseContext");
const MongoDbStrategy = require("./database/strategies/MongoDbStrategy");
const PostgresStrategy = require("./database/strategies/PostgresStrategy");

const mongoDbDatabaseContext = new DatabaseContext(new MongoDbStrategy());
const postgresDatabaseContext = new DatabaseContext(new PostgresStrategy());

const item = { name: "John" };
mongoDbDatabaseContext.create(item);
postgresDatabaseContext.create(item);

try {
  mongoDbDatabaseContext.retrieve();
} catch (error) {
  console.log(error);
}

try {
  postgresDatabaseContext.update();
} catch (error) {
  console.log(error);
}
