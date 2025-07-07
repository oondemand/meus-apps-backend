const GenericError = require("../generic");

class UsuarioNaoEncontradoError extends GenericError {
  constructor() {
    super("Usuário não encontrado!", 404);
  }
}

module.exports = UsuarioNaoEncontradoError;
