const Ticket = require("../../models/Ticket");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");

const buscarIdsPessoasFiltrados = async ({ filtros, searchTerm }) => {
  if (!filtros && !searchTerm) return [];

  const pessoasQuery = FiltersUtils.buildQuery({
    filtros,
    schema: Pessoa.schema,
    searchTerm,
    camposBusca: ["nome", "documento"],
  });

  const pessoasIds = await Pessoa.find({
    $and: pessoasQuery,
  }).select("_id");

  return pessoasIds.length > 0 ? pessoasIds.map((e) => e._id) : [];
};

const criar = async ({ ticket }) => {
  const novoTicket = new Ticket({ ...ticket, etapa: "requisicao" });
  await novoTicket.save();
  return novoTicket;
};

const listar = async () => {
  const tickets = await Ticket.find({ status: { $nin: ["arquivado"] } });
  return tickets;
};

const atualizar = async ({ id, ticket }) => {
  const ticketAtualizado = await Ticket.findByIdAndUpdate(id, ticket);
  return ticketAtualizado;
};

const listarComPaginacao = async ({
  filtros,
  pessoaFiltros,
  searchTerm,
  pageIndex,
  pageSize,
}) => {
  const queryTicket = FiltersUtils.buildQuery({
    filtros,
    schema: Ticket.schema,
    searchTerm,
    camposBusca: ["titulo", "createdAt"],
  });

  const queryCombinada = {
    $and: [...queryTicket, { status: "arquivado" }],
  };

  const { page, skip, limite } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [tickets, totalDeTickets] = await Promise.all([
    Ticket.find(queryCombinada).skip(skip).limit(limite),
    Ticket.countDocuments(queryCombinada),
  ]);

  return { tickets, totalDeTickets, page, limite };
};

module.exports = {
  criar,
  listar,
  atualizar,
  listarComPaginacao,
};
