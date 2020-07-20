const { equal, deepStrictEqual, ok } = require("assert");

const PostgresStrategy = require("./PostgresStrategy");
const postgresStrategy = new PostgresStrategy();

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
    await postgresStrategy._connect();
    await postgresStrategy._clear();
    await postgresStrategy.create(EXISTING_HERO);
  });

  this.afterAll(async () => {
    await postgresStrategy._close();
  });

  it("#create", async () => {
    const insertedHero = await postgresStrategy.create(NEW_HERO);
    heroEqual(insertedHero, NEW_HERO);
  });

  it("#read", async () => {
    const heroes = await postgresStrategy.read({ nome: EXISTING_HERO.nome });
    ok(heroes.length === 1);
    const readedHero = heroes[0];
    heroEqual(readedHero, EXISTING_HERO);
  });

  it("#update", async () => {
    const createdHero = await postgresStrategy.create(UPDATE_HERO);
    const [updateCount] = await postgresStrategy.update(
      createdHero.id,
      UPDATE_HERO_NEW_POWER
    );
    equal(updateCount, 1);
    const [updatedHero] = await postgresStrategy.read({ id: createdHero.id });
    const expectedHero = { ...UPDATE_HERO, ...UPDATE_HERO_NEW_POWER };
    heroEqual(updatedHero, expectedHero);
  });

  it("#delete", async () => {
    const createdHero = await postgresStrategy.create(DELETE_USER);
    ok(createdHero);
    const deleteCount = await postgresStrategy.delete(createdHero.id);
    equal(deleteCount, 1);
  });
});
