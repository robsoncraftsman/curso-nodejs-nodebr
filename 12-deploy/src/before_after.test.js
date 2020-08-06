const databaseConnection = require("./database/databaseConnection");

before(async () => {
  databaseConnection.connectToDatabase();
});

after(async () => {
  databaseConnection.disconnectToDatabase();
});
