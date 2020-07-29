const BaseRoutes = require("./BaseRoutes");
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");

class HeroRoutes extends BaseRoutes {
  constructor(databaseContext) {
    super();
    this._databaseContext = databaseContext;
  }

  create() {
    return {
      path: "/herois",
      method: "POST",
      config: {
        validate: {
          payload: Joi.object({
            nome: Joi.string().min(3).max(100).required(),
            poder: Joi.string().min(3).max(100).required(),
          }),
        },
      },
      handler: async (request) => {
        const { nome, poder } = request.payload;
        return await this._databaseContext.create({ nome, poder });
      },
    };
  }

  read() {
    return {
      path: "/herois/{id}",
      method: "GET",
      config: {
        validate: {
          params: Joi.object({
            id: Joi.number(),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          return await this._databaseContext.read({ _id: id });
        } catch (error) {
          console.log(error);
          return Boom.internal();
        }
      },
    };
  }

  list() {
    return {
      path: "/herois",
      method: "GET",
      config: {
        validate: {
          query: Joi.object({
            skip: Joi.number().default(0),
            limit: Joi.number().default(10),
            nome: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: async (request) => {
        const { nome, skip, limit } = request.query;
        const filter = {};
        if (nome) {
          filter.nome = { $regex: nome, $options: "i" };
        }
        return await this._databaseContext.read(filter, skip, limit);
      },
    };
  }
}

module.exports = HeroRoutes;
