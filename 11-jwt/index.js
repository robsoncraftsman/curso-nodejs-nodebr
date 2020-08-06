const databaseConnection = require("./src/database/databaseConnection");
const api = require("./src/api/api");

async function main() {
  databaseConnection.connectToDatabase();
  const server = await api.startServer();

  server.events.on("stop", async () => {
    databaseConnection.disconnectToDatabase();
  });
}

main();
