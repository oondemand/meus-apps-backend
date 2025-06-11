// const Ticket = require("../../models/Ticket");
// const Arquivo = require("../models/Arquivo");
// const { criarNomePersonalizado } = require("../utils/formatters");
// const Prestador = require("../models/Prestador");
// const Servico = require("../models/Servico");
// const Sistema = require("../models/Sistema");
// const { isEqual } = require("date-fns");
// const filterUtils = require("../utils/filter");
// const DocumentoFiscal = require("../models/DocumentoFiscal");
const {
  sendResponse,
  sendErrorResponse,
  sendPaginatedResponse,
} = require("../../utils/helpers");

const TicketService = require("../../services/ticket");

const createTicket = async (req, res) => {
  const ticket = TicketService.criar({ ticket: req.body });

  sendResponse({
    res,
    statusCode: 201,
    ticket,
  });
};

// const updateTicket = async (req, res) => {
//   const ticket = await Ticket.findByIdAndUpdate(
//     req.params.id,
//     { ...req.body },
//     { new: true, runValidators: true }
//   );

//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   const ticketPopulado = await Ticket.findById(ticket._id)
//     .populate("baseOmie")
//     .populate("servicos")
//     .populate("prestador");

//   sendResponse({
//     res,
//     statusCode: 200,
//     ticket: ticketPopulado,
//   });
// };

const getAllTickets = async (req, res) => {
  const tickets = await TicketService.listar();

  sendResponse({
    res,
    statusCode: 200,
    tickets,
  });
};

// const getTicketsByUsuarioPrestador = async (req, res) => {
//   const { usuarioId } = req.params;

//   const prestador = await Prestador.findOne({ usuario: usuarioId });
//   const config = await Sistema.findOne();

//   if (!prestador) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Não foi encontrado um prestador com id fornecido.",
//     });
//   }

//   const tickets = await Ticket.find({
//     prestador: prestador._id,
//     status: { $ne: "arquivado" },
//     etapa: { $ne: "requisicao" },
//   })
//     .populate("servicos")
//     .populate("arquivos", "nomeOriginal size mimetype tipo");

//   // Busca serviços abertos não vinculados a tickets
//   const servicosAbertos = await Servico.find({
//     prestador: prestador._id,
//     status: { $in: ["aberto", "pendente"] },
//     $or: [
//       {
//         "competencia.ano": {
//           $gt: config.data_corte_app_publisher.getFullYear(),
//         },
//       },

//       {
//         $and: [
//           {
//             "competencia.ano": config.data_corte_app_publisher.getFullYear(),
//           },
//           {
//             "competencia.mes": {
//               $gte: config.data_corte_app_publisher.getMonth() + 1, // Ajuste para meses 1-12
//             },
//           },
//         ],
//       },
//     ],
//   }).select("-dataRegistro");

//   const servicosPagosExterno = await Servico.aggregate([
//     {
//       $match: {
//         prestador: prestador?._id,
//         status: "pago-externo",
//         dataRegistro: {
//           $exists: true,
//           $ne: null,
//           $gte: config?.data_corte_app_publisher,
//         },
//       },
//     },

//     {
//       $addFields: {
//         valor: {
//           $sum: {
//             $ifNull: ["$valor", 0],
//           },
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: {
//             format: "%Y-%m-%d",
//             date: "$dataRegistro",
//           },
//         },
//         servicos: { $push: "$$ROOT" },
//         status: { $first: "$status" },
//       },
//     },
//   ]);

//   // ticket virtual para serviços abertos
//   const fakeTicket = {
//     _id: servicosAbertos[0]?._id,
//     status: "aberto",
//     servicos: servicosAbertos,
//     arquivos: [],
//     observacao: "Serviço aberto não associado a um ticket",
//   };

//   // Converte tickets reais para objetos simples e combina com os virtuais
//   const allTickets = [
//     ...tickets,
//     ...(servicosAbertos.length > 0 ? [fakeTicket] : []),
//     ...servicosPagosExterno,
//   ];

//   // Ordenação definitiva considerando todos os cenários
//   allTickets.sort((a, b) => {
//     // Extrai datas de diferentes cenários
//     const getDate = (ticket) => {
//       if (ticket.dataRegistro) return ticket.dataRegistro; // Ticket normal
//       if (ticket.servicos?.[0]?.dataRegistro)
//         return ticket.servicos[0].dataRegistro; // Serviços pagos externos
//       return null;
//     };

//     const aDate = getDate(a);
//     const bDate = getDate(b);

//     if (!aDate && !bDate) return 0;
//     if (!aDate) return -1;
//     if (!bDate) return 1;

//     // Datas mais recentes primeiro
//     return new Date(bDate) - new Date(aDate);
//   });

//   let valorTotalRecebido = 0;
//   let valorTotalPendente = 0;

//   if (allTickets.length === 0) {
//     return sendResponse({
//       res,
//       statusCode: 200,
//       valorTotalRecebido,
//       valorTotalPendente,
//       tickets: [],
//     });
//   }

//   for (const ticket of allTickets) {
//     for (const servico of ticket.servicos) {
//       if (["pago", "pago-externo"].includes(servico.status)) {
//         valorTotalRecebido += servico.valor;
//         continue;
//       }

//       valorTotalPendente += servico.valor;
//     }
//   }

//   sendResponse({
//     res,
//     statusCode: 200,
//     valorTotalRecebido,
//     valorTotalPendente,
//     tickets: allTickets,
//   });
// };

// const getTicketById = async (req, res) => {
//   const ticket = await Ticket.findById(req.params.id)
//     .populate("baseOmie")
//     .populate("arquivos")
//     .populate("documentosFiscais")
//     .populate("prestador")
//     .populate("servicos");

//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

// const deleteTicket = async (req, res) => {
//   const ticket = await Ticket.findByIdAndDelete(req.params.id);

//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

// const listFilesFromTicket = async (req, res) => {
//   const { id } = req.params;
//   const arquivos = await Arquivo.find({ ticket: id });
//   sendResponse({
//     res,
//     statusCode: 200,
//     arquivos,
//   });
// };

// const deleteFileFromTicket = async (req, res) => {
//   const { id, ticketId } = req.params;

//   const arquivo = await Arquivo.findByIdAndDelete(id);
//   const ticket = await Ticket.findByIdAndUpdate(ticketId, {
//     $pull: { arquivos: id },
//   });

//   sendResponse({
//     res,
//     statusCode: 200,
//     arquivo,
//   });
// };

// const uploadFiles = async (req, res) => {
//   const ticketId = req.params.id;
//   const ticket = await Ticket.findById(ticketId);
//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   if (!req.files || req.files.length === 0) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Nenhum arquivo enviado.",
//     });
//   }

//   const arquivosSalvos = await Promise.all(
//     req.files.map(async (file) => {
//       const arquivo = new Arquivo({
//         nome: criarNomePersonalizado({ nomeOriginal: file.originalname }),
//         nomeOriginal: file.originalname,
//         path: file.path,
//         mimetype: file.mimetype,
//         size: file.size,
//         ticket: ticket._id,
//         buffer: file.buffer,
//       });

//       await arquivo.save();
//       return arquivo;
//     })
//   );

//   ticket.arquivos.push(...arquivosSalvos.map((a) => a._id));
//   await ticket.save();

//   sendResponse({
//     res,
//     statusCode: 201,
//     arquivos: arquivosSalvos,
//   });
// };

// const getArchivedTickets = async (req, res) => {
//   const {
//     ["prestador.nome"]: prestadorNome,
//     ["prestador.tipo"]: prestadorTipo,
//     ["prestador.documento"]: prestadorDocumento,
//     status,
//     searchTerm = "",
//     sortBy,
//     pageIndex,
//     pageSize,
//     ...rest
//   } = req.query;

//   const prestadorFiltersQuery = filterUtils.queryFiltros({
//     filtros: {
//       nome: prestadorNome,
//       tipo: prestadorTipo,
//       documento: prestadorDocumento,
//     },
//     schema: Prestador.schema,
//   });

//   const prestadoresQuerySearchTerm = filterUtils.querySearchTerm({
//     schema: Prestador.schema,
//     searchTerm,
//     camposBusca: ["nome", "tipo", "documento"],
//   });

//   let prestadoresIds = [];

//   if (
//     Object.keys(prestadorFiltersQuery).length > 0 ||
//     Object.keys(prestadoresQuerySearchTerm).length > 0
//   ) {
//     prestadoresIds = await Prestador.find({
//       $and: [prestadorFiltersQuery, { $or: [prestadoresQuerySearchTerm] }],
//     }).select("_id");
//   }

//   const prestadorConditions =
//     prestadoresIds.length > 0
//       ? [{ prestador: { $in: prestadoresIds.map((e) => e._id) } }]
//       : [];

//   const filtersQuery = filterUtils.queryFiltros({
//     filtros: rest,
//     schema: Ticket.schema,
//   });

//   const searchTermCondition = filterUtils.querySearchTerm({
//     searchTerm,
//     schema: Ticket.schema,
//     camposBusca: ["titulo", "createdAt"],
//   });

//   const queryResult = {
//     $and: [
//       filtersQuery,
//       { status: "arquivado" },
//       {
//         $or: [
//           ...(Object.keys(searchTermCondition).length > 0
//             ? [searchTermCondition]
//             : []),
//           ...prestadorConditions,
//         ],
//       },
//     ],
//   };

//   let sorting = {};

//   if (sortBy) {
//     const [campo, direcao] = sortBy.split(".");
//     const campoFormatado = campo.replaceAll("_", ".");
//     sorting[campoFormatado] = direcao === "desc" ? -1 : 1;
//   }

//   const page = parseInt(pageIndex) || 0;
//   const limite = parseInt(pageSize) || 10;
//   const skip = page * limite;

//   const [tickets, totalDeTickets] = await Promise.all([
//     Ticket.find(queryResult)
//       .populate("prestador", "nome documento")
//       .populate({
//         path: "servicos",
//         options: { virtuals: true },
//       })
//       .skip(skip)
//       .limit(limite),
//     Ticket.countDocuments(queryResult),
//   ]);

//   sendPaginatedResponse({
//     res,
//     statusCode: 200,
//     results: tickets,
//     pagination: {
//       currentPage: page,
//       totalPages: Math.ceil(totalDeTickets / limite),
//       totalItems: totalDeTickets,
//       itemsPerPage: limite,
//     },
//   });
// };

// const getTicketsPago = async (req, res) => {
//   const {
//     ["prestador.nome"]: prestadorNome,
//     ["prestador.tipo"]: prestadorTipo,
//     ["prestador.documento"]: prestadorDocumento,
//     status,
//     searchTerm = "",
//     sortBy,
//     pageIndex,
//     pageSize,
//     ...rest
//   } = req.query;

//   const prestadorFiltersQuery = filterUtils.queryFiltros({
//     filtros: {
//       nome: prestadorNome,
//       tipo: prestadorTipo,
//       documento: prestadorDocumento,
//     },
//     schema: Prestador.schema,
//   });

//   const prestadoresQuerySearchTerm = filterUtils.querySearchTerm({
//     schema: Prestador.schema,
//     searchTerm,
//     camposBusca: ["nome", "tipo", "documento"],
//   });

//   const prestadoresIds = await Prestador.find({
//     $and: [prestadorFiltersQuery, { $or: [prestadoresQuerySearchTerm] }],
//   }).select("_id");

//   const prestadorConditions =
//     prestadoresIds.length > 0
//       ? [{ prestador: { $in: prestadoresIds.map((e) => e._id) } }]
//       : [];

//   const filtersQuery = filterUtils.queryFiltros({
//     filtros: rest,
//     schema: Ticket.schema,
//   });

//   const searchTermCondition = filterUtils.querySearchTerm({
//     searchTerm,
//     schema: Ticket.schema,
//     camposBusca: ["titulo", "createdAt"],
//   });

//   const queryResult = {
//     $and: [
//       {
//         status: "concluido",
//         etapa: "concluido",
//       },
//       { ...filtersQuery, status: "concluido", etapa: "concluido" },
//       { $or: [searchTermCondition, ...prestadorConditions] },
//     ],
//   };

//   let sorting = {};

//   if (sortBy) {
//     const [campo, direcao] = sortBy.split(".");
//     const campoFormatado = campo.replaceAll("_", ".");
//     sorting[campoFormatado] = direcao === "desc" ? -1 : 1;
//   }

//   const page = parseInt(pageIndex) || 0;
//   const limite = parseInt(pageSize) || 10;
//   const skip = page * limite;

//   const [tickets, totalDeTickets] = await Promise.all([
//     Ticket.find(queryResult)
//       .populate("prestador", "nome documento")
//       .populate("arquivos", "nomeOriginal size mimetype tipo")
//       .populate({
//         path: "servicos",
//         options: { virtuals: true },
//       })
//       .skip(skip)
//       .limit(limite)
//       .sort(sorting),
//     Ticket.countDocuments(queryResult),
//   ]);

//   sendPaginatedResponse({
//     res,
//     statusCode: 200,
//     results: tickets,
//     pagination: {
//       currentPage: page,
//       totalPages: Math.ceil(totalDeTickets / limite),
//       totalItems: totalDeTickets,
//       itemsPerPage: limite,
//     },
//   });
// };

// const getArquivoPorId = async (req, res) => {
//   const arquivo = await Arquivo.findById(req.params.id);
//   sendResponse({
//     res,
//     statusCode: 200,
//     arquivo,
//   });
// };

// const addServico = async (req, res) => {
//   const { ticketId, servicoId } = req.params;
//   const servico = await Servico.findById(servicoId);
//   const ticket = await Ticket.findById(ticketId);

//   if (
//     ticket?.dataRegistro &&
//     !isEqual(servico?.dataRegistro, ticket?.dataRegistro)
//   ) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Data registro conflitante.",
//     });
//   }

//   ticket.dataRegistro = servico?.dataRegistro;
//   ticket.servicos = [...ticket?.servicos, servico?._id];
//   await ticket.save();

//   servico.status = "processando";
//   await servico.save();

//   const populatedTicket = await Ticket.findById(ticket._id).populate(
//     "servicos"
//   );

//   return sendResponse({
//     res,
//     statusCode: 200,
//     ticket: populatedTicket,
//   });
// };

// const removeServico = async (req, res) => {
//   const { servicoId } = req.params;
//   await Servico.findByIdAndUpdate(
//     servicoId,
//     { status: "aberto" },
//     { new: true }
//   );

//   const ticket = await Ticket.findOneAndUpdate(
//     { servicos: servicoId }, // Busca o ticket que contém este serviço
//     { $pull: { servicos: servicoId } }, // Remove o serviço do array
//     { new: true }
//   ).populate("servicos");

//   if (ticket?.servicos.length === 0) {
//     ticket.dataRegistro = null;
//     await ticket.save();
//   }

//   return sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

// const addDocumentoFiscal = async (req, res) => {
//   const { ticketId, documentoFiscalId } = req.params;
//   const documentoFiscal = await DocumentoFiscal.findById(documentoFiscalId);
//   const ticket = await Ticket.findById(ticketId);

//   ticket.documentosFiscais = [
//     ...ticket?.documentosFiscais,
//     documentoFiscal?._id,
//   ];

//   await ticket.save();

//   documentoFiscal.status = "processando";
//   await documentoFiscal.save();

//   const populatedTicket = await Ticket.findById(ticket._id).populate(
//     "documentosFiscais"
//   );

//   return sendResponse({
//     res,
//     statusCode: 200,
//     ticket: populatedTicket,
//   });
// };

// const removeDocumentoFiscal = async (req, res) => {
//   const { documentoFiscalId } = req.params;
//   await DocumentoFiscal.findByIdAndUpdate(
//     documentoFiscalId,
//     { statusValidacao: "pendente", status: "aberto" },
//     { new: true }
//   );

//   const ticket = await Ticket.findOneAndUpdate(
//     { documentosFiscais: documentoFiscalId }, // Busca o ticket que contém este serviço
//     { $pull: { documentosFiscais: documentoFiscalId } }, // Remove o serviço do array
//     { new: true }
//   ).populate("documentosFiscais");

//   return sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

// const arquivarTicket = async (req, res) => {
//   const { id } = req.params;
//   const ticket = await Ticket.findById(id);

//   if (!ticket) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Ticket não encontrado",
//     });
//   }

//   ticket.status = "arquivado";
//   await ticket.save();

//   return sendResponse({
//     res,
//     statusCode: 200,
//     ticket,
//   });
// };

module.exports = {
  createTicket,
  getAllTickets,
};
