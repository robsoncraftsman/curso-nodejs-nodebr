const BaseRoutes = require("./BaseRoutes");
const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");

const USER = {
  username: "teste",
  password: "123",
};

const Jwt = require("jsonwebtoken");

class AuthRoutes extends BaseRoutes {
  constructor(secret) {
    super();
    this.secret = secret;
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
      handler: (request, h) => {
        const { username, password } = request.payload;
        if (
          username.toLowerCase() === USER.username &&
          password === USER.password
        ) {
          return {
            token: Jwt.sign(
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
