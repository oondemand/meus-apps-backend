const mongoose = require("mongoose");

const aplicativoSchema = new mongoose.Schema({
  url: { type: String },
  icone: { type: String },
  nome: { type: String, required: true },
  tipoAcessoUrl: { type: String },
  status: {
    type: String,
    enum: ["ativo", "inativo", "suspenso"],
    default: "ativo",
  },
  ambiente: { type: String, enum: ["prod", "homolog", "teste"] },
  usuarios: [
    {
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
      tipoAcesso: String,
    },
  ],
});

module.exports = mongoose.model("Aplicativo", aplicativoSchema);
