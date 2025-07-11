const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsuarioSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["master", "admin-app", "usuario"],
    default: "usuario",
  },
  email: { type: String, required: true, unique: true },
  telefone: { type: String },
  nome: { type: String },
  senha: { type: String },
  status: {
    type: String,
    enum: ["ativo", "inativo", "pendente"],
    default: "pendente",
  },
});

UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

UsuarioSchema.methods.gerarToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
