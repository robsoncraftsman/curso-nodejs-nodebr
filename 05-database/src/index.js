const MethodNotImplementedError = require("./MethodNotImplementedError");

const DatabaseContext = require("./database/DatabaseContext");
const MongoDbStrategy = require("./database/strategies/MongoDbStrategy");
const PostgresStrategy = require("./database/strategies/PostgresStrategy");

const mongoDbDatabaseContext = new DatabaseContext(new MongoDbStrategy());
const postgresDatabaseContext = new DatabaseContext(new PostgresStrategy());

function extractCallerName(error) {
  return error.stack.match(/at (\S+)/g)[0].slice(3);
}

function verifyIfMethodIsNotImplemented(fn) {
  try {
    fn();
  } catch (error) {
    if (error instanceof MethodNotImplementedError) {
      const callerName = extractCallerName(error);
      console.log(`${callerName} não implementado`);
    } else {
      console.log(error);
    }
  }
}

const item = { name: "John" };
mongoDbDatabaseContext.create(item);
postgresDatabaseContext.create(item);

verifyIfMethodIsNotImplemented(() => {
  mongoDbDatabaseContext.read();
});

verifyIfMethodIsNotImplemented(() => {
  mongoDbDatabaseContext.update();
});

verifyIfMethodIsNotImplemented(() => {
  mongoDbDatabaseContext.delete();
});

verifyIfMethodIsNotImplemented(() => {
  postgresDatabaseContext.read();
});

verifyIfMethodIsNotImplemented(() => {
  postgresDatabaseContext.update();
});

verifyIfMethodIsNotImplemented(() => {
  postgresDatabaseContext.delete();
});
