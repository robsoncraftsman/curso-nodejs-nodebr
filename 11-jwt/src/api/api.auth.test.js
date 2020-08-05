const { ok, strictEqual, deepStrictEqual } = require("assert");
const api = require("./api");

let server = {};

async function login() {
  const result = await server.inject({
    method: "POST",
    url: "/login",
    payload: {
      username: "teste",
      password: "123",
    },
  });

  strictEqual(result.statusCode, 200);
  return JSON.parse(result.payload).token;
}

describe("API Auth test suite", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    server = await api.startServer();
  });

  this.afterAll(async () => {
    await server.stop();
  });

  it("#login - 200", async () => {
    const token = await login();

    ok(token.length > 10);
  });

  it("#login - 401", async () => {
    const result = await server.inject({
      method: "POST",
      url: "/login",
      payload: {
        username: "nao_existe",
        password: "12345678",
      },
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
