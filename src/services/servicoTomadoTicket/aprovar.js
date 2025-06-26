const Ticket = require("../../models/ServicoTomadoTicket");
const GenericError = require("../errors/generic");
const EtapaService = require("../etapa");

const aprovar = async ({ id }) => {
  const ticket = await Ticket.findById(id).populate("pessoa");

  const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
    esteira: "servicos-tomados",
  });

  const ultimaEtapa = etapas.length - 1;
  const etapaAtualIndex = etapas.findIndex((e) => e.codigo === ticket.etapa);

  if (etapaAtualIndex === ultimaEtapa) {
    ticket.etapa = "concluido";
    ticket.status = "concluido";
    await ticket.save();
    return ticket;
  }

  if (etapaAtualIndex > ultimaEtapa || etapaAtualIndex < 0) {
    throw new GenericError("Não foi possível aprovar ticket, etapa inválida");
  }

  ticket.etapa = etapas[etapaAtualIndex + 1].codigo;
  ticket.status = "aguardando-inicio";
  await ticket.save();

  return ticket;
};

module.exports = {
  aprovar,
};
