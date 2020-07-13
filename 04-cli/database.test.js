const assert = require("assert");
const { deepEqual, ok, equal } = require("assert");
const database = require("./database");
const { isRegExp } = require("util");

const expectedHero = { nome: "Flash", poder: "Velocidade", id: 1 };
const newHero = { nome: "Ironman", poder: "Tech", id: 2 };

before(async function () {
  await database.clear();
  await database.insert(expectedHero);
});

describe("database test suit", function () {
  describe("#find()", function () {
    it("deve retornar todos heróis", async function () {
      const [data] = await database.findAll();
      deepEqual(data, expectedHero);
    });
  });

  describe("#findById()", function () {
    it("não deve retornar o heŕoi", async function () {
      const hero = await database.findById(null);
      equal(hero, null);
    });

    it("deve retornar o heŕoi 1 - Flash", async function () {
      const hero = await database.findById(expectedHero.id);
      deepEqual(hero, expectedHero);
    });
  });

  describe("#insert()", function () {
    it("deve inserir um herói", async function () {
      await database.insert(newHero);
      const hero = await database.findById(newHero.id);
      deepEqual(hero, newHero);
    });
  });

  describe("#update()", function () {
    it("deve atualizar o herói", async function () {
      const heroToUpdate = { ...expectedHero, poder: "Speed" };
      await database.update(heroToUpdate);
      const hero = await database.findById(heroToUpdate.id);
      deepEqual(hero, heroToUpdate);
    });
  });

  describe("#merge()", function () {
    it("deve atualizar apenas alguns dados do herói", async function () {
      const heroToUpdate = { poder: "Speed" };
      await database.merge(expectedHero.id, heroToUpdate);
      const hero = await database.findById(expectedHero.id);
      deepEqual(hero, { ...heroToUpdate, ...hero });
    });
  });

  describe("#delete()", function () {
    it("deve excluir o herói", async function () {
      await database.delete(expectedHero);
      const hero = await database.findById(expectedHero.id);
      equal(hero, null);
    });
  });
});
