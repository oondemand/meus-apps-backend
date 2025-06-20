const ServicoTomadoTicket = require("../../models/ServicoTomadoTicket");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const { aprovar } = require("./aprovar");
const { reprovar } = require("./reprovar");

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
  const novoTicket = new ServicoTomadoTicket({
    ...ticket,
    etapa: "requisicao",
  });
  await novoTicket.save();
  return novoTicket;
};

const listar = async () => {
  const tickets = await ServicoTomadoTicket.find({
    status: { $nin: ["arquivado"] },
  });
  return tickets;
};

const atualizar = async ({ id, ticket }) => {
  const ticketAtualizado = await ServicoTomadoTicket.findByIdAndUpdate(
    id,
    ticket,
    { new: true }
  ).populate("pessoa");

  return ticketAtualizado;
};

const obterPorId = async ({ id }) => {
  return await ServicoTomadoTicket.findById(id);
};

const excluir = async ({ id }) => {
  const ticket = await ServicoTomadoTicket.findById(id);

  ticket.status = "arquivado";
  await ticket.save();
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
    schema: ServicoTomadoTicket.schema,
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
    ServicoTomadoTicket.find(queryCombinada).skip(skip).limit(limite),
    ServicoTomadoTicket.countDocuments(queryCombinada),
  ]);

  return { tickets, totalDeTickets, page, limite };
};

module.exports = {
  criar,
  listar,
  aprovar,
  excluir,
  reprovar,
  atualizar,
  listarComPaginacao,
  obterPorId,
};
