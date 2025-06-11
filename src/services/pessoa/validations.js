const Pessoa = require("../../models/Pessoa");
const GenericError = require("../errors/generic");

const validarDocumentoExistente = async ({ pessoa }) => {
  const pessoaExistente = await Pessoa.findOne({ documento: pessoa.documento });
  if (pessoaExistente) {
    throw new GenericError("Documento já cadastrado!", 409);
  }
};

const verificarRelacaoTicketExistente = async ({ pessoa }) => {
  const relacaoComTicket = Ticket.findOne({ pessoaId: pessoa });
  if (relacaoComTicket) {
    throw new GenericError("Existe um ticket vinculado com essa pessoa!", 400);
  }
};

module.exports = {
  validarDocumentoExistente,
  verificarRelacaoTicketExistente,
};
