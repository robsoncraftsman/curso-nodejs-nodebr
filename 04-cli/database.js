const { promises } = require("fs");

const { readFile, writeFile } = require("fs").promises;

class Database {
  constructor() {
    this.FILE_NAME = "herois.json";
    this.ENCODING = "utf8";
  }

  async _readFileAsJSON() {
    const data = await readFile(this.FILE_NAME, this.ENCODING);
    if (data) {
      return JSON.parse(data.toString());
    } else {
      return [];
    }
  }

  async _writeFileAsJSON(data) {
    await writeFile(this.FILE_NAME, JSON.stringify(data), this.ENCODING);
    return true;
  }

  async findAll() {
    return await this._readFileAsJSON();
  }

  async findById(id) {
    const data = await this._readFileAsJSON();
    const [filteredData] = data.filter((item) => item.id === id);
    return filteredData;
  }

  async insert(hero) {
    const data = await this._readFileAsJSON();
    data.push(hero);
    await this._writeFileAsJSON(data);
  }

  async update(hero) {
    const data = await this._readFileAsJSON();
    const updatedData = data.map((item) => {
      return item.id !== hero.id ? item : hero;
    });
    await this._writeFileAsJSON(updatedData);
  }

  async merge(id, hero) {
    const data = await this._readFileAsJSON();
    const updatedData = data.map((item) => {
      if (item.id !== id) {
        return item;
      } else {
        return { ...item, ...hero };
      }
    });
    await this._writeFileAsJSON(updatedData);
  }

  async delete(hero) {
    const data = await this._readFileAsJSON();
    const deletedData = data.filter((item) => item.id !== hero.id);
    await this._writeFileAsJSON(deletedData);
  }

  async clear() {
    await this._writeFileAsJSON([]);
    return true;
  }
}
/*
async function findAll() {
  return new Promise((resolve, reject) => {
    readFile("herois.json", "utf8")
      .then((file) => JSON.parse(file.toString()))
      .then((data) => {
        resolve(data);
      });
  });
}

async function main() {
  const data = await findAll();
  console.log(data);
}

main();
*/
module.exports = new Database();
