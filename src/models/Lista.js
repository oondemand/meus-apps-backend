const mongoose = require("mongoose");
const { LISTAS } = require("../constants/listas");

const ListaSchema = new mongoose.Schema({
  codigo: { type: String, enum: LISTAS, required: true, unique: true },
  data: {
    type: [{ valor: String }],
    validate: {
      validator: function (data) {
        return data.length <= 500; // Limite de 500 elementos
      },
      message: "A lista de valores excedeu o limite de 500 elementos.",
    },
  },
});

module.exports = mongoose.model("Lista", ListaSchema);
