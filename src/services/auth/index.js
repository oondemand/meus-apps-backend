const bcrypt = require("bcryptjs");
const UsuarioService = require("../usuario");
const CredenciaisInvalidasError = require("../errors/auth/credenciaisInvalidas");

const login = async ({ email, senha }) => {
  const usuario = await UsuarioService.buscarUsuarioPorEmail({ email });
  if (!(await bcrypt.compare(senha, usuario.senha)))
    throw new CredenciaisInvalidasError();
  return usuario;
};

module.exports = {
  login,
};
