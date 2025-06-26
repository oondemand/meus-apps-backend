const mongoose = require("mongoose");

const documentoCadastralSchema = new mongoose.Schema(
  {
    pessoa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pessoa",
      required: [true, "Pessoa é obrigatório"],
    },
    tipoDocumento: {
      type: String,
      required: [true, "Tipo Documento é obrigatório"],
    },
    numero: {
      type: String,
      required: [true, "Número é obrigatório"],
    },
    descricao: { type: String },
    motivoRecusa: { type: String },
    observacao: { type: String },
    arquivo: { type: mongoose.Schema.Types.ObjectId, ref: "Arquivo" },
    status: {
      type: String,
      enum: ["ativo", "inativo", "arquivado"],
      default: "ativo",
    },
    statusValidacao: {
      type: String,
      enum: ["pendente", "recusado", "aprovado"],
      default: "pendente",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DocumentoCadastral", documentoCadastralSchema);
