const service = require("./service");

const skywalker = "skywalker";

function isSkywalker(name) {
  return name.toLowerCase().indexOf(skywalker) !== -1;
}

function mapPesos(results) {
  return results.map((pessoa) =>
    isNaN(pessoa.mass) ? 0 : parseInt(pessoa.mass)
  );
}

Array.prototype.meuReduce = function (callback, initial) {
  let result;
  let initialIndex;
  if (initial !== undefined) {
    result = initial;
    initialIndex = 0;
  } else {
    if (this.length === 0) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    result = this[0];
    initialIndex = 1;
  }
  for (let index = initialIndex; index < this.length; index++) {
    result = callback(result, this[index], index, this);
  }
  return result;
};

function reduceResults(pesos) {
  console.time("reduceResults");
  const pesoTotal = pesos.reduce((anterior, proximo) => {
    return anterior + proximo;
  });
  console.log("Peso total: ", pesoTotal);
  console.timeEnd("reduceResults");
}

function meuReduceResults(pesos) {
  console.time("meuReduceResults");
  const pesoTotal = pesos.meuReduce((anterior, proximo) => {
    return anterior + proximo;
  });
  console.log("Peso total: ", pesoTotal);
  console.timeEnd("meuReduceResults");
}

async function main() {
  try {
    const result = await service.obterPessoas("a");
    const results = result.results;

    const pesos = mapPesos(results);
    console.log(pesos);

    reduceResults(pesos);
    meuReduceResults(pesos);
  } catch (error) {
    console.log("Erro ao executar o programa. ", error);
  }
}

main();
