/*
Acessar "http://localhost:3000/documentation" para ver documentação
da API gerada pelo swagger
*/
const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");

const HeroRoutes = require("./routes/HeroRoutes");

const DatabaseContext = require("../database/DatabaseContext");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const mongoDbStrategy = new MongoDbStrategy(heroisModel);
const mongoDbDatabaseContext = new DatabaseContext(mongoDbStrategy);

const swaggerConfig = {
  info: {
    title: "#CursoNodeBR - API Herois",
    version: "v1.0",
  },
};

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

async function startServer() {
  const server = new Hapi.Server({
    //debug: { request: ["error"] },
    port: 3000,
    routes: {
      validate: {
        failAction: async (request, h, error) => {
          if (process.env.NODE_ENV === "production") {
            console.log("Bad Request: " + error.message);
            throw Boom.badRequest();
          } else {
            throw error;
          }
        },
      },
    },
  });

  server.validator(Joi);

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerConfig,
    },
  ]);

  server.route([
    ...mapRoutes(new HeroRoutes(mongoDbDatabaseContext), HeroRoutes.routes()),
  ]);

  await server.start();

  console.log("server running at", server.info.port);

  return server;
}

module.exports = { startServer };
