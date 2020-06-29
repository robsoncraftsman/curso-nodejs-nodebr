const service = require("./service");

const skywalker = "skywalker";

function isSkywalker(name) {
  return name.toLowerCase().indexOf(skywalker) !== -1;
}

Array.prototype.meuFilter = function (callback) {
  const result = [];
  for (let index = 0; index < this.length; index++) {
    const item = this[index];
    if (callback(item, index, this)) {
      result.push(item);
    }
  }
  return result;
};

function filterResults(results) {
  console.time("filterResults");
  const nomes = results
    .filter((pessoa) => isSkywalker(pessoa.name))
    .map((pessoa) => pessoa.name);
  console.log(nomes);
  console.timeEnd("filterResults");
}

function meuFilterResults(results) {
  console.time("meuFilterResults");
  const nomes = results
    .meuFilter((pessoa) => isSkywalker(pessoa.name))
    .map((pessoa) => pessoa.name);
  console.log(nomes);
  console.timeEnd("meuFilterResults");
}

async function main() {
  try {
    const result = await service.obterPessoas("a");
    const results = result.results;

    filterResults(results);
    meuFilterResults(results);
  } catch (error) {
    console.log("Erro ao executar o programa. ", error);
  }
}

main();
