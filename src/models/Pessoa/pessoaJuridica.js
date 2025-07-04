const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
  regimeTributario: { type: String },
  nomeFantasia: { type: String },
});

module.exports = schema;
