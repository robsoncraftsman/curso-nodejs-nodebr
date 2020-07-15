const DbStrategy = require("./DbStrategy");

class MongoDbStrategy extends DbStrategy {
  constructor() {
    super();
  }

  create(item) {
    console.log("Item created in MongoDb", item);
    return item;
  }
}

module.exports = MongoDbStrategy;
