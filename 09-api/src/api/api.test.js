const { equal, deepStrictEqual, ok } = require("assert");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const heroisMongoDbStrategy = new MongoDbStrategy(heroisModel);

const api = require("./api");
let server = {};

const EXISTING_HERO = { nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { nome: "Hulk", poder: "Força" };
const UPDATE_HERO_NEW_POWER = { poder: "Muita Força" };
const DELETE_HERO = { nome: "SpiderMan", poder: "Spider" };
const BATCH_HERO = { nome: "Aquaman", poder: "Água" };

function heroEqual(actual, expected) {
  const normalizedActual = {
    nome: actual.nome,
    poder: actual.poder,
  };
  deepStrictEqual(normalizedActual, expected);
}

describe.only("API Heroes test suite", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await MongoDbStrategy.connect("mongodb://user:pwd@localhost:27217/herois");
    await heroisMongoDbStrategy.clear();
    await heroisMongoDbStrategy.create(EXISTING_HERO);
    for (let i = 1; i <= 25; i++) {
      await heroisMongoDbStrategy.create({
        ...BATCH_HERO,
        nome: BATCH_HERO.nome + "_" + i,
      });
    }

    server = await api.startServer();
  });

  this.afterAll(async () => {
    await MongoDbStrategy.close();
    await server.stop();
  });

  it("listar /heroes - one", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois?nome=${EXISTING_HERO.nome}`,
    });
    const statusCode = result.statusCode;
    equal(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    equal(herois.length, 1);
    heroEqual(herois[0], EXISTING_HERO);
  });

  it("listar /heroes - all", async () => {
    const result = await server.inject({
      method: "GET",
      url: "/herois",
    });
    const statusCode = result.statusCode;
    equal(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
  });

  it("listar /heroes - all - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const result = await server.inject({
      method: "GET",
      url: `/herois?skip=${SKIP}&limit=${LIMIT}`,
    });
    const statusCode = result.statusCode;
    equal(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    equal(herois.length, LIMIT);
  });

  it("listar /heroes - nome - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const result = await server.inject({
      method: "GET",
      url: `/herois?nome=${BATCH_HERO.nome}&skip=${SKIP}&limit=${LIMIT}`,
    });
    const statusCode = result.statusCode;
    equal(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    equal(herois.length, LIMIT);
  });

  it("listar /heroes - bad request", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois?xpto=${EXISTING_HERO.nome}`,
    });
    equal(result.statusCode, 400);
    const payload = JSON.parse(result.payload);
    equal(payload.message, '"xpto" is not allowed');
  });

  it("listar /heroes - internal error", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois/1`,
    });
    equal(result.statusCode, 500);
  });
});
