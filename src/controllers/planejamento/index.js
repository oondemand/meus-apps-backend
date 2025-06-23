const PlanejamentoService = require("../../services/planejamento");

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

  res.status(200).json({
    servicos,
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
