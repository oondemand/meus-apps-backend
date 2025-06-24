const mongoose = require("mongoose");

const servicoSchema = new mongoose.Schema({
  tipoServicoTomado: String,
  descricao: String,
  valor: Number,
  pessoa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pessoa",
    required: [true, "Pessoa é obrigatório"],
  },
  dataContratacao: Date,
  dataConclusao: Date,
  status: {
    type: String,
    enum: ["ativo", "inativo", "arquivado"],
    default: "ativo",
  },
});

module.exports = mongoose.model("Servico", servicoSchema);
