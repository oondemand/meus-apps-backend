const mongoose = require("mongoose");
const pessoaFisica = require("./pessoaFisica");
const pessoaJuridica = require("./pessoaJuridica");
const { Schema } = mongoose;

const schema = new Schema(
  {
    grupo: {
      type: String,
    },
    tipo: {
      type: String,
      enum: ["pf", "pj", "ext"],
    },
    nome: {
      type: String,
      maxlength: 100,
    },
    pessoaFisica: pessoaFisica,
    pessoaJuridica: pessoaJuridica,
    documento: {
      type: String,
      maxlength: 20,
    },
    status: {
      type: String,
      enum: ["ativo", "inativo", "arquivado"],
      default: "ativo",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("label").get(function () {
  return `${this.nome} - ${this.documento}`;
});

module.exports = mongoose.model("Pessoa", schema);
