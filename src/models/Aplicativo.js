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
  usuarios: { type: [mongoose.Schema.Types.ObjectId], ref: "Usuario" },
});

module.exports = mongoose.model("Aplicativo", aplicativoSchema);
