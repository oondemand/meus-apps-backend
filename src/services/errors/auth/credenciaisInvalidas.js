const GenericError = require("../generic");

class CredenciaisInvalidasError extends GenericError {
  constructor() {
    super("Credenciais inválidas!", 401);
  }
}

module.exports = CredenciaisInvalidasError;
