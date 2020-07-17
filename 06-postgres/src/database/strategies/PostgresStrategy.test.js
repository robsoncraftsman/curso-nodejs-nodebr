const { equal, deepEqual, ok } = require("assert");

const PostgresStrategy = require("./PostgresStrategy");
const postgresStrategy = new PostgresStrategy();

const EXISTING_HERO = { id: 1, nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { id: 2, nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { id: 3, nome: "Hulk", poder: "Força" };
const NEW_POWER = { poder: "Muita Força" };

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
    deepEqual(NEW_HERO, insertedHero);
  });

  it("#read", async () => {
    const heroes = await postgresStrategy.read(EXISTING_HERO.id);
    ok(heroes.length === 1);
    const readedHero = heroes[0];
    deepEqual(EXISTING_HERO, readedHero);
  });

  it("#update", async () => {
    await postgresStrategy.create(UPDATE_HERO);
    const [updateCount] = await postgresStrategy.update(
      UPDATE_HERO.id,
      NEW_POWER
    );
    equal(updateCount, 1);
    const [updatedHero] = await postgresStrategy.read(UPDATE_HERO.id);
    const expectedHero = { ...UPDATE_HERO, ...NEW_POWER };
    deepEqual(expectedHero, updatedHero);
  });

  it("#delete", async () => {
    const deleteCount = await postgresStrategy.delete(EXISTING_HERO.id);
    equal(deleteCount, 1);
  });
});
