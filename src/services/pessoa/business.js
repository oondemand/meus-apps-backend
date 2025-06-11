const Pessoa = require("../../models/Pessoa");
const Validations = require("./validations");

const criar = async ({ pessoa }) => {
  Validations.validarDocumentoExistente({ pessoa });
  const novaPessoa = new Pessoa(pessoa);
  return await novaPessoa.save();
};

const excluir = async ({ id }) => {
  const pessoa = await Pessoa.findById(id);
  // Validations.verificarRelacaoTicketExistente({ pessoa });
  pessoa.status = "arquivado";
  return await pessoa.save();
};

module.exports = {
  criar,
  excluir,
};
