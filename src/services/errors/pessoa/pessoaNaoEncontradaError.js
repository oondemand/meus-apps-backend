const GenericError = require("../generic");

class PessoaNaoEncontradaError extends GenericError {
  constructor() {
    super("Pessoa não encontrada!", 404);
  }
}

module.exports = PessoaNaoEncontradaError;
