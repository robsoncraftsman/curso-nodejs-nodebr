const { equal, deepEqual, ok } = require("assert");

const MongoDbStrategy = require("./MongoDbStrategy");
const mongoDbStrategy = new MongoDbStrategy();

const EXISTING_HERO = { id: 1, nome: "Flash", poder: "Velocidade" };
const NEW_HERO = { id: 2, nome: "IronMan", poder: "Tech" };
const UPDATE_HERO = { id: 3, nome: "Hulk", poder: "Força" };
const NEW_POWER = { poder: "Muita Força" };

function normalizeHero(hero) {
  return {
    id: hero.id,
    nome: hero.nome,
    poder: hero.poder,
  };
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
    deepEqual(normalizeHero(insertedHero), NEW_HERO);
  });

  it("#read", async () => {
    const heroes = await mongoDbStrategy.read({ id: EXISTING_HERO.id });
    ok(heroes.length === 1);
    const readedHero = normalizeHero(heroes[0]);
    deepEqual(readedHero, EXISTING_HERO);
  });

  it("#update", async () => {
    await mongoDbStrategy.create(UPDATE_HERO);
    const updateResult = await mongoDbStrategy.update(
      UPDATE_HERO.id,
      NEW_POWER
    );
    equal(updateResult.nModified, 1);
    const [updatedHero] = await mongoDbStrategy.read({ id: UPDATE_HERO.id });
    const expectedHero = { ...UPDATE_HERO, ...NEW_POWER };
    deepEqual(normalizeHero(updatedHero), expectedHero);
  });

  it("#delete", async () => {
    const deleteResult = await mongoDbStrategy.delete(EXISTING_HERO.id);
    equal(deleteResult.deletedCount, 1);
  });
});
