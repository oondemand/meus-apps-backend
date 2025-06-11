const Ticket = require("../../models/Ticket");

const criar = async ({ ticket }) => {
  const novoTicket = new Ticket({ ...ticket, etapa: "requisicao" });
  await novoTicket.save();
  return novoTicket;
};

const listar = async () => {
  const tickets = await Ticket.find({ status: { $nin: ["arquivado"] } });
  return tickets;
};

module.exports = {
  criar,
  listar,
};
