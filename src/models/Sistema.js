const mongoose = require("mongoose");

const sistemaSchema = new mongoose.Schema(
  {
    sendgrid_api_key: { type: String },
    remetente: { type: { nome: String, email: String } },
    assistentes: { type: { appKey: String } },
  },
  { timestamps: true }
);

const Sistema = mongoose.model("Sistema", sistemaSchema);

module.exports = Sistema;
