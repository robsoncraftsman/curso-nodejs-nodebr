const { strictEqual, deepStrictEqual, ok } = require("assert");
const PasswordHelper = require("./PasswordHelper");

const PASSWORD = "#Minha$Senha&Forte926!";
const EXPECTED_HASH_LENGTH = 60;
const EXPECTED_HASH =
  "$2b$10$728WS4vX17mPrq.1ubcQTOQVk5YzXXDt/03jTz5pOqVV49agO6aLy";

describe("PasswordHelper test suite", function () {
  it("Deve retornar o hash da senha", async () => {
    const hash = await PasswordHelper.hashPassword(PASSWORD);
    strictEqual(hash.length, EXPECTED_HASH_LENGTH);
  });

  it("Deve verificar que o hash está certo", async () => {
    const isPasswordOk = await PasswordHelper.comparePassword(
      PASSWORD,
      EXPECTED_HASH
    );
    ok(isPasswordOk);
  });
});
