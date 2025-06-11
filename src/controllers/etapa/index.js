const Etapa = require("../../models/Etapa");
const filtersUtils = require("../../utils/pagination/filter");

const {
  sendResponse,
  sendErrorResponse,
  sendPaginatedResponse,
} = require("../../utils/helpers");

const criarEtapa = async (req, res) => {
  const etapa = new Etapa(req.body);
  await etapa.save();
  sendResponse({
    res,
    statusCode: 201,
    etapa,
  });
};

const listarEtapas = async (req, res) => {
  const { sortBy, pageIndex, pageSize, searchTerm, tipo, ...rest } = req.query;

  const schema = Etapa.schema;

  const camposBusca = ["codigo", "nome", "posicao", "status"];

  // Monta a query para buscar serviços baseados nos demais filtros
  const filterFromFiltros = filtersUtils.queryFiltros({
    filtros: rest,
    schema,
  });

  // Monta a query para buscar serviços baseados no searchTerm
  const searchTermCondition = filtersUtils.querySearchTerm({
    searchTerm,
    schema,
    camposBusca,
  });

  const queryResult = {
    $and: [
      filterFromFiltros, // Filtros principais
      searchTermCondition, // Filtros de busca
    ],
  };

  let sorting = {};

  if (sortBy) {
    const [campo, direcao] = sortBy.split(".");
    const campoFormatado = campo.replaceAll("_", ".");
    sorting[campoFormatado] = direcao === "desc" ? -1 : 1;
  }

  const page = parseInt(pageIndex) || 0;
  const limite = parseInt(pageSize) || 10;
  const skip = page * limite;

  const [etapas, totalDeEtapas] = await Promise.all([
    Etapa.find(queryResult).skip(skip).limit(limite),
    Etapa.countDocuments(queryResult),
  ]);

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: etapas,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeEtapas / limite),
      totalItems: totalDeEtapas,
      itemsPerPage: limite,
    },
  });
};

const listarEtapasAtivas = async (req, res) => {
  const etapas = await Etapa.find({ status: "ativo" }).sort({ posicao: 1 });
  sendResponse({
    res,
    statusCode: 200,
    etapas,
  });
};

const obterEtapa = async (req, res) => {
  const etapa = await Etapa.findById(req.params.id);
  if (!etapa) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: "Etapa não encontrada",
    });
  }
  sendResponse({
    res,
    statusCode: 200,
    etapa,
  });
};

const atualizarEtapa = async (req, res) => {
  const etapa = await Etapa.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!etapa) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: "Etapa não encontrada",
    });
  }
  sendResponse({
    res,
    statusCode: 200,
    etapa,
  });
};

const excluirEtapa = async (req, res) => {
  const etapa = await Etapa.findByIdAndDelete(req.params.id);
  if (!etapa) {
    return sendErrorResponse({
      res,
      statusCode: 404,
      message: "Etapa não encontrada",
    });
  }
  sendResponse({
    res,
    statusCode: 200,
    etapa,
  });
};

module.exports = {
  criarEtapa,
  listarEtapas,
  listarEtapasAtivas,
};
