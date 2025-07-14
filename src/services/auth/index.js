const bcrypt = require("bcryptjs");
const UsuarioService = require("../usuario");
const CredenciaisInvalidasError = require("../errors/auth/credenciaisInvalidas");
const GenericError = require("../errors/generic");
const Usuario = require("../../models/Usuario");
const jwt = require("jsonwebtoken");

const login = async ({ email, senha }) => {
  const usuario = await UsuarioService.buscarUsuarioPorEmail({ email });
  if (!(await bcrypt.compare(senha, usuario.senha)))
    throw new CredenciaisInvalidasError();
  return usuario;
};

const primeiroAcesso = async ({ body }) => {
  if (!body.code)
    throw new GenericError(
      "Você não tem permissão para realizar essa operação, o link de primeiro acesso pode estar inválido",
      401
    );

  const decoded = jwt.verify(body.code, process.env.JWT_SECRET);
  const usuario = await Usuario.findById(decoded.id);

  Object.assign(usuario, { ...body, status: "ativo" });
  await usuario.save();

  if (!usuario) throw new GenericError("Usuário não encontrado", 401);

  return usuario;
};

module.exports = {
  login,
  primeiroAcesso,
};
