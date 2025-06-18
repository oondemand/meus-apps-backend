const GenericError = require("../generic");

class EtapaNaoEncontradaError extends GenericError {
  constructor() {
    super("Etapa não encontrada!", 404);
  }
}

module.exports = EtapaNaoEncontradaError;
