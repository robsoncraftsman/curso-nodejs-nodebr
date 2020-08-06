const mongoose = require("mongoose");

(async () => {
  await mongoose.connect("mongodb://user:pwd@localhost:27217/herois", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const heroiSchema = new mongoose.Schema({
    nome: {
      type: String,
      required: true,
    },
    poder: {
      type: String,
      required: true,
    },
  });

  const heroisModel = mongoose.model("herois", heroiSchema);

  const insertionResult = await heroisModel.create({
    nome: "IronMan",
    poder: "Tech",
  });

  console.log("Insertion Result", insertionResult);

  const herois = await heroisModel.find();
  console.log("Heróis: ", herois);

  mongoose.connection.close();
})();
