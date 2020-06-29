const service = require("./service");

Array.prototype.meuMap = function (callback) {
  const result = [];
  for (let index = 0; index < this.length; index++) {
    result.push(callback(this[index], index));
  }
  return result;
};

function forEachResults(results) {
  console.time("forEachResults");
  const nomes = [];
  results.forEach((pessoa) => {
    nomes.push(pessoa.name);
  });
  console.log(nomes);
  console.timeEnd("forEachResults");
}

function mapResults(results) {
  console.time("mapResults");
  const nomes = results.map((pessoa) => pessoa.name);
  console.log(nomes);
  console.timeEnd("mapResults");
}

function meuMapResults(results) {
  console.time("meuMapResults");
  const nomes = results.meuMap((pessoa, index) => `[${index}] ${pessoa.name}`);
  console.log(nomes);
  console.timeEnd("meuMapResults");
}

async function main() {
  try {
    const result = await service.obterPessoas("a");
    const results = result.results;

    forEachResults(results);
    mapResults(results);
    meuMapResults(results);
  } catch (error) {
    console.log("Erro ao executar o programa. ", error);
  }
}

main();
