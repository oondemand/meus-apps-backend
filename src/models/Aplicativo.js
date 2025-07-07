const mongoose = require("mongoose");

const aplicativoSchema = new mongoose.Schema({
  url: { type: String },
  icone: { type: String },
  nome: { type: String, required: true },
  status: {
    type: String,
    enum: ["ativo", "inativo", "suspenso"],
    default: "ativo",
  },
});

module.exports = mongoose.model("Aplicativo", aplicativoSchema);
