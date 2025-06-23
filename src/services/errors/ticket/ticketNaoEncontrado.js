const GenericError = require("../generic");

class TicketNaoEncontradoError extends GenericError {
  constructor() {
    super("Ticket não encontrado!", 404);
  }
}

module.exports = TicketNaoEncontradoError;
