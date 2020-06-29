const service = require("./service");

function forResults(results) {
  console.time("forResults");
  for (let index = 0; index < results.length; index++) {
    const pessoa = results[index];
    console.log(pessoa.name);
  }
  console.timeEnd("forResults");
}

function forInResults(results) {
  console.time("forInResults");
  for (index in results) {
    const pessoa = results[index];
    console.log(pessoa.name);
  }
  console.timeEnd("forInResults");
}

function forOfResults(results) {
  console.time("forOfResults");
  for (pessoa of results) {
    console.log(pessoa.name);
  }
  console.timeEnd("forOfResults");
}

function forEachResults(results) {
  console.time("forEachResults");
  results.forEach((pessoa) => {
    console.log(pessoa.name);
  });
  console.timeEnd("forEachResults");
}

async function main() {
  try {
    const result = await service.obterPessoas("a");
    const results = result.results;

    forResults(results);
    forInResults(results);
    forOfResults(results);
    forEachResults(results);
  } catch (error) {
    console.log("Erro ao executar o programa. ", error);
  }
}

main();
