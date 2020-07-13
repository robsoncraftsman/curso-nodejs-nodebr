const commander = require("commander");
const Heroi = require("./heroi");
const database = require("./database");

function clearUndefinedProperties(obj) {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
}

async function main() {
  commander
    .version("v1")
    .option("-n, --nome [value]", "adicionar nome")
    .option("-p, --poder [value]", "adicionar poder")
    .option("-c, --cadastrar", "cadastrar Heroi")
    .option("-l, --listar [value]", "listar herois pelo id")
    .option("-a, --atualizar [value]", "atualizar heroi pelo id")
    .option("-r, --remover [value]", "remover heroi pelo id")
    .parse(process.argv);

  const heroi = new Heroi(commander);
  try {
    if (commander.listar) {
      const id = parseInt(commander.listar);
      let result;
      if (isNaN(id)) {
        result = await database.findAll();
      } else {
        result = await database.findById(id);
      }
      console.log(result);
      return;
    }

    if (commander.cadastrar) {
      await database.insert(heroi);
      console.log("Item cadastrado com sucesso");
      return;
    }

    if (commander.atualizar) {
      const id = parseInt(commander.atualizar);
      delete heroi.id;
      clearUndefinedProperties(heroi);
      await database.merge(id, heroi);
      console.log("Item atualizado com sucesso");
      return;
    }

    if (commander.remover) {
      const id = parseInt(commander.remover);
      await database.delete({ id });
      console.log("Item removido com sucesso");
      return;
    }
  } catch (error) {
    console.error("Erro ao executar o programa", error);
    return;
  }
}

main();
