const GenericError = require("../generic");

class ListaOmieNaoEncontradaError extends GenericError {
  constructor() {
    super("ListaOmie não encontrada!", 404);
  }
}

module.exports = ListaOmieNaoEncontradaError;
