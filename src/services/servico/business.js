const Servico = require("../../models/Servico");

const criar = async ({ servico }) => {
  const novaServico = new Servico(servico);
  return await novaServico.save();
};

const excluir = async ({ id }) => {
  const servico = await Servico.findById(id);
  servico.status = "arquivado";
  return await servico.save();
};

module.exports = {
  criar,
  excluir,
};
