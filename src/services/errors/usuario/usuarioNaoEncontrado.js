const GenericError = require("../generic");

class UsuarioNaoEncontradoError extends GenericError {
  constructor() {
    super("Usuario não encontrado!", 404);
  }
}

module.exports = UsuarioNaoEncontradoError;
