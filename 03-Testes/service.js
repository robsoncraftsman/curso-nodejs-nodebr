const axios = require("axios");
const baseUrl = "https://swapi.dev/api/people";

async function obterPessoas(nome) {
  const url = `${baseUrl}/?search=${nome}&format=json`;
  const response = await axios.get(url);
  return response.data;
}

module.exports = { baseUrl, obterPessoas };
