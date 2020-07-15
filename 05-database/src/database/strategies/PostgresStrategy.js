const DbStrategy = require("./DbStrategy");

class PostgresStrategy extends DbStrategy {
  constructor() {
    super();
  }

  create(item) {
    console.log("Item created in Postgres", item);
    return item;
  }
}

module.exports = PostgresStrategy;
