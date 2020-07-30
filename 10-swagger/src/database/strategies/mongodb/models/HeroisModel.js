const mongoose = require("mongoose");

const heroisSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  poder: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("herois", heroisSchema);
