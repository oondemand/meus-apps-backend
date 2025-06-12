const GenericError = require("../generic");

class ServicoNaoEncontradoError extends GenericError {
  constructor() {
    super("Servico não encontrado!", 404);
  }
}

module.exports = ServicoNaoEncontradoError;
