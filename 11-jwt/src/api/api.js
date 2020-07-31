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
const Jwt = require("jsonwebtoken");
const HapiJwt = require("hapi-auth-jwt2");

const HeroRoutes = require("./routes/HeroRoutes");

const DatabaseContext = require("../database/DatabaseContext");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const AuthRoutes = require("./routes/AuthRoutes");
const mongoDbStrategy = new MongoDbStrategy(heroisModel);
const mongoDbDatabaseContext = new DatabaseContext(mongoDbStrategy);

const JWT_SECRET = "963$meutokenseguro$147";

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
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerConfig,
    },
  ]);

  server.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    validate: async (decoded, request, h) => {
      return {
        isValid: true,
      };
    },
  });

  server.auth.default("jwt");

  server.route([
    ...mapRoutes(new HeroRoutes(mongoDbDatabaseContext), HeroRoutes.routes()),
    ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.routes()),
  ]);

  await server.start();

  console.log("server running at", server.info.port);

  return server;
}

module.exports = { startServer };
