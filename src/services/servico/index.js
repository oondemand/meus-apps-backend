const Servico = require("../../models/Servico");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");

const criar = async ({ servico }) => {
  const novoServico = new Servico(servico);
  await novoServico.save();
  return novoServico;
};

const atualizar = async ({ id, servico }) => {
  const servicoAtualizada = await Servico.findByIdAndUpdate(id, servico, {
    new: true,
  });
  if (!servicoAtualizada) return new ServicoNaoEncontradaError();
  return servicoAtualizada;
};

const buscarPorId = async ({ id }) => {
  const servico = await Servico.findById(id);
  if (!servico || !id) throw new ServicoNaoEncontradaError();
  return servico;
};

const excluir = async ({ id }) => {
  const servico = await Servico.findById(id);
  servico.status = "arquivado";
  return await servico.save();
};

const listarComPaginacao = async ({
  filtros,
  searchTerm,
  pageIndex,
  pageSize,
}) => {
  const camposBusca = [
    "tipoServicoTomado",
    "descricao",
    "valor",
    "dataContratacao",
    "dataConclusao",
    "status",
  ];

  const query = FiltersUtils.buildQuery({
    filtros,
    schema: Servico.schema,
    searchTerm,
    camposBusca,
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [servicos, totalDeServicos] = await Promise.all([
    Servico.find({
      $and: [...query, { status: { $ne: "arquivado" } }],
    })
      .skip(skip)
      .limit(limite),
    Servico.countDocuments({
      $and: [...query, { status: { $ne: "arquivado" } }],
    }),
  ]);

  return { servicos, totalDeServicos, page, limite };
};

module.exports = {
  criar,
  atualizar,
  excluir,
  buscarPorId,
  listarComPaginacao,
};
