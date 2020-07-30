const { equal, deepStrictEqual, ok } = require("assert");

const DatabaseContext = require("./DatabaseContext");
const MongoDbStrategy = require("./strategies/mongodb/MongoDbStrategy");
const heroisModel = require("./strategies/mongodb/models/HeroisModel");
const mongoDbStrategy = new MongoDbStrategy(heroisModel);
const mongoDbDatabaseContext = new DatabaseContext(mongoDbStrategy);

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

describe("DatabaseContext -> MongoDB", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await MongoDbStrategy.connect("mongodb://user:pwd@localhost:27217/herois");
    await mongoDbDatabaseContext.clear();
    await mongoDbDatabaseContext.create(EXISTING_HERO);
    for (let i = 1; i <= 25; i++) {
      await mongoDbDatabaseContext.create({
        ...EXISTING_HERO,
        nome: EXISTING_HERO.nome + "_" + i,
      });
    }
  });

  this.afterAll(async () => {
    await MongoDbStrategy.close();
  });

  it("#create", async () => {
    const insertedHero = await mongoDbDatabaseContext.create(NEW_HERO);
    ok(insertedHero);
    heroEqual(insertedHero, NEW_HERO);
  });

  it("#read one", async () => {
    const heroes = await mongoDbDatabaseContext.read({
      nome: EXISTING_HERO.nome,
    });
    equal(heroes.length, 1);
    const readedHero = heroes[0];
    heroEqual(readedHero, EXISTING_HERO);
  });

  it("#read all - skip 0 - limit 5", async () => {
    const SKIP = 0;
    const LIMIT = 5;
    const heroes = await mongoDbDatabaseContext.read({}, SKIP, LIMIT);
    equal(heroes.length, LIMIT);
  });

  it("#update", async () => {
    const createdHero = await mongoDbDatabaseContext.create(UPDATE_HERO);
    const updateResult = await mongoDbDatabaseContext.update(
      createdHero._id,
      UPDATE_HERO_NEW_POWER
    );
    equal(updateResult.nModified, 1);
    const [updatedHero] = await mongoDbDatabaseContext.read({
      _id: createdHero.id,
    });
    const expectedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    heroEqual(updatedHero, expectedHero);
  });

  it("#delete", async () => {
    const createdHero = await mongoDbDatabaseContext.create(DELETE_HERO);
    ok(createdHero);
    const deleteResult = await mongoDbDatabaseContext.delete(createdHero._id);
    equal(deleteResult.deletedCount, 1);
  });
});
