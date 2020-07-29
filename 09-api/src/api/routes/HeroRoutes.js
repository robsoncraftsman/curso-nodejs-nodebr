const BaseRoutes = require("./BaseRoutes");
const Joi = require("@hapi/joi");

class HeroRoutes extends BaseRoutes {
  constructor(databaseContext) {
    super();
    this._databaseContext = databaseContext;
  }

  list() {
    return {
      path: "/herois",
      method: "GET",
      config: {
        validate: {
          failAction: (request, h, err) => {
            throw err;
          },
          query: {
            skip: Joi.number().default(0),
            limit: Joi.number().default(10),
            name: Joi.string().min(3).max(100),
          },
        },
      },
      handler: (request, headers) => {
        const { skip, limit } = request.query;
        return this._databaseContext.read({}, skip, limit);
      },
    };
  }
}

module.exports = HeroRoutes;
