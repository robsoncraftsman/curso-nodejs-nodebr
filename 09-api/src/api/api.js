const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");

const HeroRoutes = require("./routes/HeroRoutes");

const DatabaseContext = require("../database/DatabaseContext");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const mongoDbStrategy = new MongoDbStrategy(heroisModel);
const mongoDbDatabaseContext = new DatabaseContext(mongoDbStrategy);

const server = new Hapi.Server({
  port: 3000,
  routes: {
    validate: {
      failAction: async (request, h, error) => {
        if (process.env.NODE_ENV === "production") {
          console.log("Bad Request: " + error.message);
          throw Boom.badRequest();
        } else {
          //console.error(error);
          throw error;
        }
      },
    },
  },
});

server.validator(Joi);

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function startServer() {
  server.route([
    ...mapRoutes(new HeroRoutes(mongoDbDatabaseContext), HeroRoutes.routes()),
  ]);

  await server.start();
  console.log("server running at", server.info.port);

  return server;
}

module.exports = { startServer };
