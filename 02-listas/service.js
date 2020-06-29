const axios = require("axios");
const baseurl = "https://swapi.dev/api/people";

async function obterPessoas(nome) {
  const url = `${baseurl}/?search=${nome}&format=json`;
  const response = await axios.get(url);
  return response.data;
}

/*
obterPessoas("r2")
  .then((pessoas) => {
    console.log(pessoas);
  })
  .catch((error) => {
    console.log("Erro ao consultar nomes. ", error);
  });
*/

module.exports = { obterPessoas };
