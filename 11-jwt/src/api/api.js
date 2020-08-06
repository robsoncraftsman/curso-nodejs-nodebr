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
const HapiJwt = require("hapi-auth-jwt2");

const HeroRoutes = require("./routes/HeroRoutes");
const AuthRoutes = require("./routes/AuthRoutes");

const databaseConnection = require("../database/databaseConnection");
const DatabaseContext = require("../database/DatabaseContext");

const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const heroisMongoDbStrategy = new MongoDbStrategy(heroisModel);
const heroisMongoDbDatabaseContext = new DatabaseContext(heroisMongoDbStrategy);

const PostgresStrategy = require("../database/strategies/postgres/PostgresStrategy");
const usuariosModel = require("../database/strategies/postgres/models/UsuariosModel")(
  databaseConnection.sequelize
);
const usuariosPostgresStrategy = new PostgresStrategy(
  databaseConnection.sequelize,
  usuariosModel
);
const usuariosPostgresDatabaseContext = new DatabaseContext(
  usuariosPostgresStrategy
);

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

function createServer() {
  return new Hapi.Server({
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
}

function configureValidator(server) {
  server.validator(Joi);
}

function registerPlugins(server) {
  return server.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerConfig,
    },
  ]);
}

function configureAuthentication(server) {
  server.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,
    validate: async (decoded, request, h) => {
      return {
        isValid: true,
      };
    },
  });

  server.auth.default("jwt");
}

function configureRoutes(server) {
  server.route([
    ...mapRoutes(
      new HeroRoutes(heroisMongoDbDatabaseContext),
      HeroRoutes.routes()
    ),
    ...mapRoutes(
      new AuthRoutes(usuariosPostgresDatabaseContext, JWT_SECRET),
      AuthRoutes.routes()
    ),
  ]);
}

async function startServer() {
  const server = createServer();

  configureValidator(server);

  await registerPlugins(server);

  configureAuthentication(server);

  configureRoutes(server);

  await server.start();

  console.log("server running at", server.info.port);

  return server;
}

module.exports = { startServer };
