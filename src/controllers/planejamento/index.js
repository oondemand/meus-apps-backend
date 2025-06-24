const PlanejamentoService = require("../../services/planejamento");
const { sendPaginatedResponse } = require("../../utils/helpers");

const listar = async (req, res) => {
  const {
    ["prestador.nome"]: nome,
    ["prestador.tipo"]: tipo,
    ["prestador.documento"]: documento,
    searchTerm,
    pageIndex,
    pageSize,
    ...rest
  } = req.query;

  const { limite, page, servicos, totalDeServicos } =
    await PlanejamentoService.listarServicosComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    results: servicos,
    statusCode: 200,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeServicos / limite),
      totalItems: totalDeServicos,
      itemsPerPage: limite,
    },
  });
};

module.exports = {
  listar,
};
