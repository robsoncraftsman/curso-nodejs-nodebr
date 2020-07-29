const { equal, deepStrictEqual, ok } = require("assert");

const PostgresStrategy = require("./PostgresStrategy");
const connectionOptions = {
  database: "herois",
  username: "admin",
  password: "pwd",
  host: "localhost",
  dialect: "postgres",
};
const sequelize = PostgresStrategy.createSequelize(connectionOptions);
const heroisModel = require("./models/HeroisModel")(sequelize);
const heroisPostgresStrategy = new PostgresStrategy(sequelize, heroisModel);

const EXISTING_HERO = { nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { nome: "Hulk", poder: "Força" };
const UPDATE_HERO_NEW_POWER = { poder: "Muita Força" };
const DELETE_USER = { nome: "SpiderMan", poder: "Aranha" };

function heroEqual(actual, expected) {
  const normalizedActual = {
    nome: actual.nome,
    poder: actual.poder,
  };
  deepStrictEqual(normalizedActual, expected);
}

describe("PostgresStrategy", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await sequelize.authenticate();
    await heroisPostgresStrategy.clear();
    await heroisPostgresStrategy.create(EXISTING_HERO);
    for (let i = 1; i <= 25; i++) {
      await heroisPostgresStrategy.create({
        ...EXISTING_HERO,
        nome: EXISTING_HERO.nome + "_" + i,
      });
    }
  });

  this.afterAll(async () => {
    await sequelize.close();
  });

  it("#create", async () => {
    const insertedHero = await heroisPostgresStrategy.create(NEW_HERO);
    heroEqual(insertedHero, NEW_HERO);
  });

  it("#read one", async () => {
    const heroes = await heroisPostgresStrategy.read({
      nome: EXISTING_HERO.nome,
    });
    ok(heroes.length === 1);
    const readedHero = heroes[0];
    heroEqual(readedHero, EXISTING_HERO);
  });

  it("#read all - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const heroes = await heroisPostgresStrategy.read({}, SKIP, LIMIT);
    equal(heroes.length, LIMIT);
  });

  it("#update", async () => {
    const createdHero = await heroisPostgresStrategy.create(UPDATE_HERO);
    const [updateCount] = await heroisPostgresStrategy.update(
      createdHero.id,
      UPDATE_HERO_NEW_POWER
    );
    equal(updateCount, 1);
    const [updatedHero] = await heroisPostgresStrategy.read({
      id: createdHero.id,
    });
    const expectedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    heroEqual(updatedHero, expectedHero);
  });

  it("#delete", async () => {
    const createdHero = await heroisPostgresStrategy.create(DELETE_USER);
    ok(createdHero);
    const deleteCount = await heroisPostgresStrategy.delete(createdHero.id);
    equal(deleteCount, 1);
  });
});
