const { equal, deepEqual, ok } = require("assert");

const PostgresStrategy = require("./PostgresStrategy");
const postgressStrategy = new PostgresStrategy();

const EXISTING_HERO = { id: 1, nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { id: 2, nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { id: 3, nome: "Hulk", poder: "Força" };
const NEW_POWER = { poder: "Muita Força" };

describe("PostgresStrategy", function () {
  this.timeout(Infinity);

  this.beforeAll(async function () {
    await postgressStrategy.clear();
    await postgressStrategy.create(EXISTING_HERO);
  });

  it("Init connection", async function () {
    const connected = await postgressStrategy._connect();
    ok(connected);
  });

  it("#create", async function () {
    const insertedHero = await postgressStrategy.create(NEW_HERO);
    deepEqual(NEW_HERO, insertedHero);
  });

  it("#read", async function () {
    const heroes = await postgressStrategy.read(EXISTING_HERO.id);
    ok(heroes.length === 1);
    const readedHero = heroes[0];
    deepEqual(EXISTING_HERO, readedHero);
  });

  it("#update", async function () {
    await postgressStrategy.create(UPDATE_HERO);
    const [updateCount] = await postgressStrategy.update(
      UPDATE_HERO.id,
      NEW_POWER
    );
    equal(updateCount, 1);
    const [updatedHero] = await postgressStrategy.read(UPDATE_HERO.id);
    const expectedHero = { ...UPDATE_HERO, ...NEW_POWER };
    deepEqual(expectedHero, updatedHero);
  });

  it("#delete", async function () {
    const deleteCount = await postgressStrategy.delete(EXISTING_HERO.id);
    equal(deleteCount, 1);
  });

  it("#clear", async function () {
    const deleteCount = await postgressStrategy.clear();
    ok(deleteCount > 0);
  });

  it("Close connection", async function () {
    const closed = await postgressStrategy._close();
    ok(closed);
  });
});
