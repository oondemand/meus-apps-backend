const GenericError = require("../generic");

class AssistenteNaoEncontradoError extends GenericError {
  constructor() {
    super("Assistente não encontrado!", 404);
  }
}

module.exports = AssistenteNaoEncontradoError;
