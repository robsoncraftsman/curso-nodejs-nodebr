const { strictEqual, deepStrictEqual, ok } = require("assert");
const MongoDbStrategy = require("../database/strategies/mongodb/MongoDbStrategy");
const heroisModel = require("../database/strategies/mongodb/models/HeroisModel");
const heroisMongoDbStrategy = new MongoDbStrategy(heroisModel);

const api = require("./api");

let server = {};
let EXISTING_ID;
let UPDATE_ID;
let DELETE_ID;
let TOKEN_JWT;

const EXISTING_HERO = { nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { nome: "Hulk", poder: "Força" };
const UPDATE_HERO_NEW_POWER = { poder: "Muita Força" };
const PATCH_HERO = { nome: "Nome atualizado", poder: "Força atualizada" };
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
    headers: {
      authorization: TOKEN_JWT,
    },
  });
  strictEqual(result.statusCode, 200);
  const herois = JSON.parse(result.payload);
  ok(Array.isArray(herois));
  if (herois.length === 1) {
    return herois[0];
  } else {
    return null;
  }
}

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

describe("API Heroes test suite", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    server = await api.startServer();

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

    TOKEN_JWT = await login();
  });

  this.afterAll(async () => {
    await server.stop();
  });

  it("listar /heroes - one", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois?nome=${EXISTING_HERO.nome}`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    const statusCode = result.statusCode;
    strictEqual(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    strictEqual(herois.length, 1);
    heroEqual(herois[0], EXISTING_HERO);
  });

  it("listar /heroes - all", async () => {
    const result = await server.inject({
      method: "GET",
      url: "/herois",
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    const statusCode = result.statusCode;
    strictEqual(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
  });

  it("listar /heroes - all - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const result = await server.inject({
      method: "GET",
      url: `/herois?skip=${SKIP}&limit=${LIMIT}`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    const statusCode = result.statusCode;
    strictEqual(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    strictEqual(herois.length, LIMIT);
  });

  it("listar /heroes - nome - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const result = await server.inject({
      method: "GET",
      url: `/herois?nome=${BATCH_HERO.nome}&skip=${SKIP}&limit=${LIMIT}`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    const statusCode = result.statusCode;
    strictEqual(statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    strictEqual(herois.length, LIMIT);
  });

  it("listar /heroes - bad request", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois?xpto=${EXISTING_HERO.nome}`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    strictEqual(result.statusCode, 400);
    const payload = JSON.parse(result.payload);
    strictEqual(payload.message, '"xpto" is not allowed');
  });

  it("listar /herois/:id - ok", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois/${EXISTING_ID}`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    strictEqual(result.statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    strictEqual(herois.length, 1);
    heroEqual(herois[0], EXISTING_HERO);
  });

  it("listar /herois/:id - not found", async () => {
    const result = await server.inject({
      method: "GET",
      url: `/herois/000000000000000000000000`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    strictEqual(result.statusCode, 200);
    const herois = JSON.parse(result.payload);
    ok(Array.isArray(herois));
    strictEqual(herois.length, 0);
  });

  it("create /herois", async () => {
    const result = await server.inject({
      method: "POST",
      url: "/herois",
      payload: NEW_HERO,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    strictEqual(result.statusCode, 200);
    const heroi = JSON.parse(result.payload);
    heroEqual(heroi, NEW_HERO);
  });

  it("update /herois/id", async () => {
    const updatedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    const result = await server.inject({
      method: "PUT",
      url: `/herois/${UPDATE_ID}`,
      headers: {
        authorization: TOKEN_JWT,
      },
      payload: updatedHero,
    });
    strictEqual(result.statusCode, 200);
    const nModified = JSON.parse(result.payload).nModified;
    strictEqual(nModified, 1);
    const heroi = await findHero(UPDATE_ID);
    heroEqual(heroi, updatedHero);
  });

  it("patch /herois/id", async () => {
    const result = await server.inject({
      method: "PATCH",
      url: `/herois/${UPDATE_ID}`,
      headers: {
        authorization: TOKEN_JWT,
      },
      payload: PATCH_HERO,
    });
    strictEqual(result.statusCode, 200);
    const nModified = JSON.parse(result.payload).nModified;
    strictEqual(nModified, 1);
    const heroi = await findHero(UPDATE_ID);
    heroEqual(heroi, PATCH_HERO);
  });

  it("delete /herois/id", async () => {
    const result = await server.inject({
      method: "DELETE",
      url: `/herois/${DELETE_ID}`,
      headers: {
        authorization: TOKEN_JWT,
      },
    });
    strictEqual(result.statusCode, 200);
    const deletedCount = JSON.parse(result.payload).deletedCount;
    strictEqual(deletedCount, 1);
    const heroi = await findHero(DELETE_ID);
    strictEqual(heroi, null);
  });
});
