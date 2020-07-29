const { equal, deepStrictEqual, ok } = require("assert");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const api = require("./api");

let server = {};
describe("API Heroes test suite", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await MongoDbStrategy.connect("mongodb://user:pwd@localhost:27217/herois");
    server = await api.startServer();
  });

  this.afterAll(async () => {
    await MongoDbStrategy.close();
    await server.stop();
  });

  it("listar /heroes", async () => {
    const result = await server.inject({
      method: "GET",
      url: "/herois",
    });
    const statusCode = result.statusCode;
    deepStrictEqual(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
  });

  it("listar /heroes - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const result = await server.inject({
      method: "GET",
      url: `/herois?skip=${SKIP}&limit=${LIMIT}`,
    });
    const statusCode = result.statusCode;
    deepStrictEqual(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    equal(herois.length, LIMIT);
  });
});
