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
      options: {
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
      options: {
        validate: {
          params: Joi.object({
            id: Joi.string().required(),
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
      options: {
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

  update() {
    return {
      path: "/herois/{id}",
      method: "POST",
      options: {
        validate: {
          params: {
            id: Joi.string().required(),
          },
          payload: Joi.object({
            nome: Joi.string().min(3).max(100).required(),
            poder: Joi.string().min(3).max(100).required(),
          }),
        },
      },
      handler: async (request) => {
        const { id } = request.params;
        const updateValues = {};
        const { nome, poder } = request.payload;
        return await this._databaseContext.update(id, { nome, poder });
      },
    };
  }

  patch() {
    return {
      path: "/herois/{id}",
      method: "PATCH",
      options: {
        validate: {
          params: {
            id: Joi.string().required(),
          },
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            poder: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: async (request) => {
        const { id } = request.params;
        const updateValues = {};
        const { nome, poder } = request.payload;
        if (nome) {
          updateValues.nome = nome;
        }
        if (poder) {
          updateValues.poder = poder;
        }
        return await this._databaseContext.update(id, updateValues);
      },
    };
  }

  delete() {
    return {
      path: "/herois/{id}",
      method: "DELETE",
      options: {
        validate: {
          params: {
            id: Joi.string().required(),
          },
        },
      },
      handler: async (request) => {
        const { id } = request.params;
        return await this._databaseContext.delete(id);
      },
    };
  }
}

module.exports = HeroRoutes;
