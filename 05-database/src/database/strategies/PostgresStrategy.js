const DbStrategy = require("./DbStrategy");

class PostgresStrategy extends DbStrategy {
  constructor() {
    super();
  }

  create(item) {
    console.log("Item created in Postgres", item);
  }
}

module.exports = PostgresStrategy;
