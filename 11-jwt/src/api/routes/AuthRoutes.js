const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const BaseRoutes = require("./BaseRoutes");
const PasswordHelper = require("../../helpers/PasswordHelper");

const jwt = require("jsonwebtoken");

class AuthRoutes extends BaseRoutes {
  constructor(databaseContext, secret) {
    super();
    this.secret = secret;
    this._databaseContext = databaseContext;
  }

  login() {
    return {
      path: "/login",
      method: "POST",
      options: {
        auth: false,
        tags: ["api"],
        description: "Login",
        notes: "Realiza o login do usuário e retorna um token JWT",
        validate: {
          payload: {
            username: Joi.string().min(3).max(100).required(),
            password: Joi.string().min(3).max(100).required(),
          },
        },
      },
      handler: async (request, h) => {
        const { username, password } = request.payload;

        const [usuario] = await this._databaseContext.read({ username });
        if (!usuario) {
          return Boom.unauthorized();
        }

        const isValidUser =
          username.toLowerCase() === usuario.username.toLowerCase();
        const isValidPassword = await PasswordHelper.comparePassword(
          password,
          usuario.password
        );
        if (isValidUser && isValidPassword) {
          return {
            token: jwt.sign(
              {
                username: username,
              },
              this.secret
            ),
          };
        } else {
          return Boom.unauthorized();
        }
      },
    };
  }

  test() {
    return {
      path: "/test",
      method: "GET",
      options: {
        auth: "jwt",
        validate: {
          headers: Joi.object({
            authorization: Joi.string().required(),
          }).unknown(),
        },
      },
      handler: function (request, h) {
        const response = h.response({ result: "You are authorized" });
        //response.header("Authorization", request.headers.authorization);
        return response;
      },
    };
  }
}
module.exports = AuthRoutes;
