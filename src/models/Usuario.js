const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UsuarioSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["master", "admin-app", "padrao"],
    default: "padrao",
  },
  email: { type: String, required: true, unique: true },
  telefone: { type: String },
  nome: { type: String },
  senha: { type: String },
  aplicativos: [
    {
      aplicativo: { type: mongoose.Schema.Types.ObjectId, ref: "Aplicativo" },
      tipoAcesso: String,
    },
  ],
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

UsuarioSchema.methods.gerarToken = function (props = {}) {
  return jwt.sign({ id: this._id, ...props }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

module.exports = mongoose.model("Usuario", UsuarioSchema);
