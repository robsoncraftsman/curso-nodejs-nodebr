const { equal, deepStrictEqual, ok } = require("assert");

const DatabaseContext = require("./DatabaseContext");
const PostgresStrategy = require("./strategies/postgres/PostgresStrategy");
const connectionOptions = {
  database: "herois",
  username: "admin",
  password: "pwd",
  host: "localhost",
  dialect: "postgres",
};
const sequelize = PostgresStrategy.createSequelize(connectionOptions);
const heroisModel = require("./strategies/postgres/models/HeroisModel")(
  sequelize
);
const postgresDatabaseContext = new DatabaseContext(
  new PostgresStrategy(sequelize, heroisModel)
);

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
    await sequelize.authenticate();
    await postgresDatabaseContext.clear();
    await postgresDatabaseContext.create(EXISTING_HERO);
  });

  this.afterAll(async () => {
    await sequelize.close();
  });

  it("#create", async () => {
    const insertedHero = await postgresDatabaseContext.create(NEW_HERO);
    ok(insertedHero);
    heroEqual(insertedHero, NEW_HERO);
  });

  it("#read", async () => {
    const heroes = await postgresDatabaseContext.read({
      nome: EXISTING_HERO.nome,
    });
    ok(heroes.length === 1);
    const readedHero = heroes[0];
    heroEqual(readedHero, EXISTING_HERO);
  });

  it("#update", async () => {
    const createdHero = await postgresDatabaseContext.create(UPDATE_HERO);
    const updateResult = await postgresDatabaseContext.update(
      createdHero.id,
      UPDATE_HERO_NEW_POWER
    );
    equal(updateResult, 1);
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
    equal(deleteResult, 1);
  });
});
