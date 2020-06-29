const service = require("./service");
const assert = require("assert");
const nock = require("nock");

function runTests() {
  describe("Service", function () {
    describe("#obterPessoas()", function () {
      it("Deve retornar R2D2 no formato json", async function () {
        const expectedName = "R2-D2";
        const expectedPessoa = { name: "R2-D2", height: "96" };

        const result = await service.obterPessoas(expectedName);
        const pessoa = result.results[0];

        assert.ok(pessoa);
        assert.deepEqual(
          { name: pessoa.name, height: pessoa.height },
          expectedPessoa
        );
      });
    });

    describe("#obterPessoas() > Nock", function () {
      it("Deve retornar R2D2 no formato json usando nock", async function () {
        const expectedName = "R2-D2";
        const expectedPessoa = { name: "R2-D2", height: "96" };

        nock(service.baseUrl)
          .get(`/?search=${expectedName}&format=json`)
          .reply(200, expectedPessoa);

        const pessoa = await service.obterPessoas(expectedName);

        assert.ok(pessoa);
        assert.deepEqual(
          { name: pessoa.name, height: pessoa.height },
          expectedPessoa
        );
      });
    });
  });
}

module.exports = { runTests };
