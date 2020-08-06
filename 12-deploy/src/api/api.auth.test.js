const { ok, strictEqual, deepStrictEqual } = require("assert");
const api = require("./api");

const databaseConnection = require("../database/databaseConnection");
const PostgresStrategy = require("../database/strategies/postgres/PostgresStrategy");
const usuariosModel = require("../database/strategies/postgres/models/UsuariosModel")(
  databaseConnection.sequelize
);
const usuariosPostgresStrategy = new PostgresStrategy(
  databaseConnection.sequelize,
  usuariosModel
);

const PasswordHelper = require("../helpers/PasswordHelper");

const EXISTING_USER = {
  username: "teste",
  password: "123",
};

const UNEXISTING_USER = {
  username: "nao_existe",
  password: "12345678",
};

const INVALID_PASSWORD_USER = {
  username: "teste",
  password: "12345678",
};

let server = {};

async function login() {
  const result = await server.inject({
    method: "POST",
    url: "/login",
    payload: EXISTING_USER,
  });

  strictEqual(result.statusCode, 200);
  return JSON.parse(result.payload).token;
}

describe("API Auth test suite", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await usuariosPostgresStrategy.clear();
    await usuariosPostgresStrategy.create({
      username: EXISTING_USER.username,
      password: await PasswordHelper.hashPassword(EXISTING_USER.password),
    });

    server = await api.startServer();
  });

  this.afterAll(async () => {
    await server.stop();
  });

  it("#login - 200", async () => {
    const token = await login();

    ok(token.length > 10);
  });

  it("#login - 401 - usuário não existe", async () => {
    const result = await server.inject({
      method: "POST",
      url: "/login",
      payload: UNEXISTING_USER,
    });

    strictEqual(result.statusCode, 401);
    strictEqual(JSON.parse(result.payload).error, "Unauthorized");
  });

  it("#login - 401 - senha incorreta", async () => {
    const result = await server.inject({
      method: "POST",
      url: "/login",
      payload: INVALID_PASSWORD_USER,
    });

    strictEqual(result.statusCode, 401);
    strictEqual(JSON.parse(result.payload).error, "Unauthorized");
  });

  it("#test - deve dar acesso negado", async () => {
    const result = await server.inject({
      method: "GET",
      url: "/test",
    });
    strictEqual(result.statusCode, 401);
    strictEqual(
      result.payload,
      '{"statusCode":401,"error":"Unauthorized","message":"Missing authentication"}'
    );
  });

  it("#test - deve acessar a URL", async () => {
    const tokenJwt = await login();
    const result = await server.inject({
      method: "GET",
      url: "/test",
      headers: {
        authorization: tokenJwt,
      },
    });
    strictEqual(result.statusCode, 200);
    deepStrictEqual(JSON.parse(result.payload), {
      result: "You are authorized",
    });
  });
});
