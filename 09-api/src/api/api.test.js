const { equal, deepStrictEqual, ok } = require("assert");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const heroisMongoDbStrategy = new MongoDbStrategy(heroisModel);

const api = require("./api");
let server = {};
let EXISTING_ID;
let UPDATE_ID;
let DELETE_ID;

const EXISTING_HERO = { nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { nome: "Hulk", poder: "Força" };
const UPDATE_HERO_NEW_POWER = { poder: "Muita Força" };
const UPDATE_HERO_PATCH = { poder: "Força atualizada" };
const DELETE_HERO = { nome: "SpiderMan", poder: "Spider" };
const BATCH_HERO = { nome: "Aquaman", poder: "Água" };

function heroEqual(actual, expected) {
  const normalizedActual = {
    nome: actual.nome,
    poder: actual.poder,
  };
  deepStrictEqual(normalizedActual, expected);
}

async function findHero(id) {
  const result = await server.inject({
    method: "GET",
    url: `/herois/${id}`,
  });
  equal(result.statusCode, 200);
  const herois = JSON.parse(result.payload);
  ok(Array.isArray(herois));
  if (herois.length === 1) {
    return herois[0];
  } else {
    return null;
  }
}

describe("API Heroes test suite", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await MongoDbStrategy.connect("mongodb://user:pwd@localhost:27217/herois");
    await heroisMongoDbStrategy.clear();
    EXISTING_ID = (await heroisMongoDbStrategy.create(EXISTING_HERO)).id;
    UPDATE_ID = (await heroisMongoDbStrategy.create(UPDATE_HERO)).id;
    DELETE_ID = (await heroisMongoDbStrategy.create(DELETE_HERO)).id;

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

  it("listar /herois/:id - ok", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois/${EXISTING_ID}`,
    });
    equal(result.statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    equal(herois.length, 1);
    heroEqual(herois[0], EXISTING_HERO);
  });

  it("listar /herois/:id - not found", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois/000000000000000000000000`,
    });
    equal(result.statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    equal(herois.length, 0);
  });

  it("create /herois", async () => {
    const result = await server.inject({
      method: "POST",
      url: "/herois",
      payload: NEW_HERO,
    });
    equal(result.statusCode, 200);
    const heroi = JSON.parse(result.payload);
    heroEqual(heroi, NEW_HERO);
  });

  it("update /herois/id", async () => {
    const updatedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    const result = await server.inject({
      method: "POST",
      url: `/herois/${UPDATE_ID}`,
      payload: updatedHero,
    });
    equal(result.statusCode, 200);
    const nModified = JSON.parse(result.payload).nModified;
    equal(nModified, 1);
    const heroi = await findHero(UPDATE_ID);
    heroEqual(heroi, updatedHero);
  });

  it("patch /herois/id", async () => {
    const updatedHero = { ...UPDATE_HERO, ...UPDATE_HERO_PATCH };
    const result = await server.inject({
      method: "PATCH",
      url: `/herois/${UPDATE_ID}`,
      payload: UPDATE_HERO_PATCH,
    });
    equal(result.statusCode, 200);
    const nModified = JSON.parse(result.payload).nModified;
    equal(nModified, 1);
    const heroi = await findHero(UPDATE_ID);
    heroEqual(heroi, updatedHero);
  });

  it("delete /herois/id", async () => {
    const result = await server.inject({
      method: "DELETE",
      url: `/herois/${DELETE_ID}`,
    });
    equal(result.statusCode, 200);
    const deletedCount = JSON.parse(result.payload).deletedCount;
    equal(deletedCount, 1);
    const heroi = await findHero(DELETE_ID);
    equal(heroi, null);
  });
});
