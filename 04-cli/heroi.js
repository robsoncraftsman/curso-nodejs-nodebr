class Heroi {
  constructor({ id, nome, poder }) {
    this.nome = nome;
    this.poder = poder;
    this.id = parseInt(id) || Date.now();
  }
}

module.exports = Heroi;
