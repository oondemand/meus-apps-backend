const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema({
  tipoServicoTomado: String,
  descricao: String,
  valor: Number,
  dataContratacao: Date,
  dataConclusao: Date,
  status: {
    type: String,
    enum: ["ativo", "inativo", "arquivado"],
    default: "ativo",
  },
});

module.exports = mongoose.model("Servico", servicoSchema);
