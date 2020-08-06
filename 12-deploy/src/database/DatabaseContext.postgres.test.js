const { strictEqual, deepStrictEqual, ok } = require("assert");

const databaseConnection = require("./databaseConnection");
const DatabaseContext = require("./DatabaseContext");
const PostgresStrategy = require("./strategies/postgres/PostgresStrategy");
const heroisModel = require("./strategies/postgres/models/HeroisModel")(
  databaseConnection.sequelize
);
const postgresStrategy = new PostgresStrategy(
  databaseConnection.sequelize,
  heroisModel
);
const postgresDatabaseContext = new DatabaseContext(postgresStrategy);

const EXISTING_HERO = { nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { nome: "Hulk", poder: "Força" };
const UPDATE_HERO_NEW_POWER = { poder: "Muita Força" };
const DELETE_HERO = { nome: "SpiderMan", poder: "Spider" };

function heroEqual(actual, expected) {
  const normalizedActual = {
    nome: actual.nome,
    poder: actual.poder,
  };
  deepStrictEqual(normalizedActual, expected);
}

describe("DatabaseContext -> Postgres", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await postgresDatabaseContext.clear();
    await postgresDatabaseContext.create(EXISTING_HERO);
    for (let i = 1; i <= 25; i++) {
      await postgresDatabaseContext.create({
        ...EXISTING_HERO,
        nome: EXISTING_HERO.nome + "_" + i,
      });
    }
  });

  it("#create", async () => {
    const insertedHero = await postgresDatabaseContext.create(NEW_HERO);
    ok(insertedHero);
    heroEqual(insertedHero, NEW_HERO);
  });

  it("#read one", async () => {
    const heroes = await postgresDatabaseContext.read({
      nome: EXISTING_HERO.nome,
    });
    strictEqual(heroes.length, 1);
    const readedHero = heroes[0];
    heroEqual(readedHero, EXISTING_HERO);
  });

  it("#read all - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const heroes = await postgresDatabaseContext.read({}, SKIP, LIMIT);
    strictEqual(heroes.length, LIMIT);
  });

  it("#update", async () => {
    const createdHero = await postgresDatabaseContext.create(UPDATE_HERO);
    const [updateResult] = await postgresDatabaseContext.update(
      createdHero.id,
      UPDATE_HERO_NEW_POWER
    );
    strictEqual(updateResult, 1);
    const [updatedHero] = await postgresDatabaseContext.read({
      id: createdHero.id,
    });
    const expectedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    heroEqual(updatedHero, expectedHero);
  });

  it("#delete", async () => {
    const createdHero = await postgresDatabaseContext.create(DELETE_HERO);
    ok(createdHero);
    const deleteResult = await postgresDatabaseContext.delete(createdHero.id);
    strictEqual(deleteResult, 1);
  });
});
