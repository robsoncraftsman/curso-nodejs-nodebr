const { strictEqual, fail, AssertionError } = require("assert");
const DbStrategy = require("./DbStrategy");
const dbStrategy = new DbStrategy();

function extractCallerName(error) {
  return error.stack.match(/at (\S+)/g)[0].slice(3);
}

async function verifyIfMethodIsNotImplemented(functionName, fn) {
  try {
    await fn();
    fail("Deve dar erro na chamada da função");
  } catch (error) {
    if (error instanceof AssertionError) throw error;
    const callerName = extractCallerName(error);
    strictEqual(`DbStrategy.${functionName}`, callerName);
  }
}

describe("DbStrategy teste suit", function () {
  it("#create", async () => {
    verifyIfMethodIsNotImplemented("create", async () => {
      await dbStrategy.create();
    });
  });

  it("#read", async () => {
    verifyIfMethodIsNotImplemented("read", async () => {
      await dbStrategy.read();
    });
  });

  it("#update", async () => {
    verifyIfMethodIsNotImplemented("update", async () => {
      await dbStrategy.update();
    });
  });

  it("#delete", async () => {
    verifyIfMethodIsNotImplemented("delete", async () => {
      await dbStrategy.delete();
    });
  });

  it("#clear", async () => {
    verifyIfMethodIsNotImplemented("clear", async () => {
      await dbStrategy.clear();
    });
  });
});
