const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  rg: { type: String },
  dataNascimento: { type: Date },
  apelido: { type: String },
});

module.exports = schema;
