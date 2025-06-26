const Servico = require("../../models/Servico");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const { registrarAcao } = require("../../services/controleService");
const ServicoTomadoTicket = require("../../models/ServicoTomadoTicket");
const {
  ACOES,
  ENTIDADES,
  ORIGENS,
} = require("../../constants/controleAlteracao");
const EtapaService = require("../etapa");

const ServicoNaoEncontradaError = require("../errors/servico/servicoNaoEncontrado");

const listarServicosComPaginacao = async ({
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
    "statusProcessamento",
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
      .limit(limite)
      .populate("pessoa", "nome documento tipo"),
    Servico.countDocuments({
      $and: [...query, { status: { $ne: "arquivado" } }],
    }),
  ]);

  return { servicos, totalDeServicos, page, limite };
};

const estatisticas = async () => {
  const aggregationPipeline = [
    {
      $group: {
        _id: "$statusProcessamento",
        total: {
          $sum: {
            $ifNull: ["$valor", 0],
          },
        },
        count: { $sum: 1 },
        pessoasUnicas: { $addToSet: "$pessoa" },
      },
    },
    {
      $project: {
        _id: 0,
        statusProcessamento: "$_id",
        total: 1,
        count: 1,
        pessoasCount: { $size: "$pessoasUnicas" },
      },
    },
  ];

  return await Servico.aggregate(aggregationPipeline);
};

const processarMultiplosServicos = async ({
  ids,
  statusProcessamento,
  usuario,
}) => {
  const result = await Servico.updateMany(
    { _id: { $in: ids } },
    { $set: { statusProcessamento: statusProcessamento } }
  );

  const servicos = await Servico.find({ _id: { $in: ids } });

  for (const servico of servicos) {
    await registrarAcao({
      acao: ACOES.ALTERADO,
      entidade: ENTIDADES.SERVICO,
      origem: ORIGENS.PLANEJAMENTO,
      usuario: usuario,
      idRegistro: servico._id,
      dadosAtualizados: servico,
    });
  }

  return result;
};

const processarServico = async ({ id, servico, usuario }) => {
  const servicoAtualizada = await Servico.findByIdAndUpdate(id, servico, {
    new: true,
  });
  if (!servicoAtualizada) return new ServicoNaoEncontradaError();

  await registrarAcao({
    acao: ACOES.ALTERADO,
    entidade: ENTIDADES.SERVICO,
    origem: ORIGENS.PLANEJAMENTO,
    usuario: usuario,
    idRegistro: servicoAtualizada._id,
    dadosAtualizados: servicoAtualizada,
  });

  return servicoAtualizada;
};

const sincronizarEsteira = async ({ usuario }) => {
  const servicos = await Servico.find({
    statusProcessamento: "pendente",
  }).populate("pessoa", "nome documento");

  for (const servico of servicos) {
    let ticket = await ServicoTomadoTicket.findOneAndUpdate(
      {
        pessoa: servico.pessoa._id,
        status: { $ne: "arquivado" },
      },
      { $push: { servicos: servico._id } },
      { new: true }
    );

    if (ticket) {
      registrarAcao({
        entidade: ENTIDADES.TICKET,
        acao: ACOES.ALTERADO,
        origem: ORIGENS.PLANEJAMENTO,
        dadosAtualizados: ticket,
        idRegistro: ticket._id,
        usuario: usuario,
      });
    }

    if (!ticket) {
      const etapas = await EtapaService.listarEtapasAtivasPorEsteira({
        esteira: "servicos-tomados",
      });

      ticket = new ServicoTomadoTicket({
        pessoa: servico.pessoa._id,
        titulo: `Comissão ${servico.pessoa.nome} - ${servico.pessoa?.documento}`,
        servicos: [servico._id],
        etapa: etapas[0]?.codigo,
        dataRegistro: servico?.dataRegistro,
      });

      registrarAcao({
        entidade: ENTIDADES.TICKET,
        acao: ACOES.ADICIONADO,
        origem: ORIGENS.PLANEJAMENTO,
        dadosAtualizados: ticket,
        idRegistro: ticket._id,
        usuario: usuario,
      });
    }

    await ticket.save();
    servico.statusProcessamento = "processando";
    await servico.save();
  }
};

module.exports = {
  listarServicosComPaginacao,
  processarMultiplosServicos,
  estatisticas,
  processarServico,
  sincronizarEsteira,
};
