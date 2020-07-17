// create
db.herois.insert({ nome: "Iron man", poder: "Tech" });

// read
db.herois.find().pretty();

// update
db.herois.update({ _id: id }, { $set: { poder: "HiTech" } });

// delete
db.herois.deleteOne({ _id: id });
