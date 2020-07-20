const { equal, deepStrictEqual, ok } = require("assert");

const MongoDbStrategy = require("./MongoDbStrategy");
const mongoDbStrategy = new MongoDbStrategy();

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

describe("MongoDbStrategy", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await mongoDbStrategy._connect();
    await mongoDbStrategy._clear();
    await mongoDbStrategy.create(EXISTING_HERO);
  });

  this.afterAll(async () => {
    await mongoDbStrategy._close();
  });

  it("#create", async () => {
    const insertedHero = await mongoDbStrategy.create(NEW_HERO);
    ok(insertedHero);
    heroEqual(insertedHero, NEW_HERO);
  });

  it("#read", async () => {
    const heroes = await mongoDbStrategy.read({ nome: EXISTING_HERO.nome });
    ok(heroes.length === 1);
    const readedHero = heroes[0];
    heroEqual(readedHero, EXISTING_HERO);
  });

  it("#update", async () => {
    const createdHero = await mongoDbStrategy.create(UPDATE_HERO);
    const updateResult = await mongoDbStrategy.update(
      createdHero._id,
      UPDATE_HERO_NEW_POWER
    );
    equal(updateResult.nModified, 1);
    const [updatedHero] = await mongoDbStrategy.read({ _id: createdHero.id });
    const expectedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    heroEqual(updatedHero, expectedHero);
  });

  it("#delete", async () => {
    const createdHero = await mongoDbStrategy.create(DELETE_HERO);
    ok(createdHero);
    const deleteResult = await mongoDbStrategy.delete(createdHero._id);
    equal(deleteResult.deletedCount, 1);
  });
});
