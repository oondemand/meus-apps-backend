// const Prestador = require("../../models/Prestador");
// const Ticket = require("../../models/Ticket");
// const Arquivo = require("../../models/Arquivo");
// const Servico = require("../../models/Servico");
// const Etapa = require("../../models/Etapa");

const DocumentoCadastralService = require("../../services/documentoCadastral");

// const DocumentoCadastral = require("../../models/DocumentoCadastral");

// const filtersUtils = require("../../utils/filter");
// const { criarNomePersonalizado } = require("../../utils/formatters");

// const { registrarAcao } = require("../../services/controleService");
// const {
//   ACOES,
//   ENTIDADES,
//   ORIGENS,
// } = require("../../constants/controleAlteracao");

const {
  sendPaginatedResponse,
  sendResponse,
  // sendErrorResponse,
} = require("../../utils/helpers");

const criar = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.criar({
    documentoCadastral: req.body,
  });

  sendResponse({
    res,
    statusCode: 201,
    documentoCadastral,
  });
};

// const criarDocumentoCadastralPorUsuarioPrestador = async (req, res) => {
//   const usuario = req.usuario;
//   const arquivo = req.file;

//   if (!arquivo) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Arquivo é um campo obrigatório",
//     });
//   }

//   const prestador = await Prestador.findOne({
//     usuario: usuario._id,
//   });

//   if (!prestador) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Prestador não encontrado",
//     });
//   }

//   const filteredBody = Object.fromEntries(
//     Object.entries(req.body).filter(([_, value]) => value !== "")
//   );

//   const novoArquivo = new Arquivo({
//     nome: criarNomePersonalizado({ nomeOriginal: arquivo.originalname }),
//     nomeOriginal: arquivo.originalname,
//     mimetype: arquivo.mimetype,
//     size: arquivo.size,
//     buffer: arquivo.buffer,
//     tipo: "documento-cadastral",
//   });

//   await novoArquivo.save();

//   const novoDocumentoCadastral = new DocumentoCadastral({
//     ...filteredBody,
//     prestador: prestador._id,
//     arquivo: novoArquivo._id,
//   });

//   await novoDocumentoCadastral.save();

//   return sendResponse({
//     res,
//     statusCode: 201,
//     documentoCadastral: novoDocumentoCadastral,
//   });
// };

// const updateDocumentoCadastral = async (req, res) => {
//   const { id } = req.params;
//   const updateData = req.body;

//   const documentoCadastral = await DocumentoCadastral.findById(id);

//   if (!documentoCadastral) {
//     return sendErrorResponse({
//       res,
//       statusCode: 404,
//       message: "Documento Cadastral não encontrado",
//     });
//   }

//   const documentoCadastralAtualizado =
//     await DocumentoCadastral.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//   return sendResponse({
//     res,
//     statusCode: 200,
//     documentoCadastral: documentoCadastralAtualizado,
//   });
// };

const listar = async (req, res) => {
  const { pageIndex, pageSize, searchTerm, ...rest } = req.query;
  const { documentosCadastrais, limite, totalDeDocumentosCadastrais, page } =
    await DocumentoCadastralService.listarComPaginacao({
      filtros: rest,
      pageIndex,
      pageSize,
      searchTerm,
    });

  sendPaginatedResponse({
    res,
    statusCode: 200,
    results: documentosCadastrais,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalDeDocumentosCadastrais / limite),
      totalItems: totalDeDocumentosCadastrais,
      itemsPerPage: limite,
    },
  });
};

// const listarDocumentoCadastralPorPrestador = async (req, res) => {
//   try {
//     const { prestadorId } = req.params;

//     const documentosCadastrais = await DocumentoCadastral.find({
//       prestador: prestadorId,
//       statusValidacao: "aprovado",
//     }).populate("arquivo");

//     return sendResponse({
//       res,
//       statusCode: 200,
//       documentosCadastrais,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Erro ao buscar documentos cadastrais",
//       error: error.message,
//     });
//   }
// };

// const listarDocumentoCadastralPorUsuarioPrestador = async (req, res) => {
//   try {
//     const prestador = await Prestador.findOne({
//       usuario: req.usuario,
//     });

//     const documentosCadastrais = await DocumentoCadastral.find({
//       prestador: prestador,
//     }).populate("prestador", "sid nome documento");

//     return sendResponse({
//       res,
//       statusCode: 200,
//       documentosCadastrais,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Erro ao buscar documentos cadastrais",
//       error: error.message,
//     });
//   }
// };

// const excluirDocumentoCadastral = async (req, res) => {
//   try {
//     const documentoCadastralId = req.params.id;

//     await Ticket.updateMany(
//       { documentosCadastrais: documentoCadastralId },
//       { $pull: { documentosCadastrais: documentoCadastralId } }
//     );

//     const documentoCadastral = await DocumentoCadastral.findByIdAndDelete(
//       documentoCadastralId
//     );

//     if (!documentoCadastral) {
//       return sendErrorResponse({
//         res,
//         statusCode: 404,
//         message: "Documento Cadastral não encontrado",
//       });
//     }

//     return sendResponse({
//       res,
//       statusCode: 200,
//       data: documentoCadastral,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Erro ao excluir documento cadastral",
//       error: error.message,
//     });
//   }
// };

// const anexarArquivo = async (req, res) => {
//   try {
//     const arquivo = req.file;
//     const documentoCadastralId = req.params.documentoCadastralId;

//     const documentoCadastral = await DocumentoCadastral.findById(
//       documentoCadastralId
//     );

//     const novoArquivo = new Arquivo({
//       nome: criarNomePersonalizado({ nomeOriginal: arquivo.originalname }),
//       nomeOriginal: arquivo.originalname,
//       mimetype: arquivo.mimetype,
//       size: arquivo.size,
//       buffer: arquivo.buffer,
//       tipo: "documento-cadastral",
//     });

//     await novoArquivo?.save();

//     documentoCadastral.arquivo = novoArquivo._id;
//     await documentoCadastral.save();

//     return sendResponse({
//       res,
//       statusCode: 200,
//       arquivo: novoArquivo,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Ouve um erro ao anexar o arquivo",
//       error: error.message,
//     });
//   }
// };

// const excluirArquivo = async (req, res) => {
//   try {
//     const { id, documentoCadastralId } = req.params;

//     const arquivo = await Arquivo.findByIdAndDelete(id);

//     await DocumentoCadastral.findByIdAndUpdate(documentoCadastralId, {
//       $unset: { arquivo: id },
//     });

//     return sendResponse({
//       res,
//       statusCode: 200,
//       arquivo,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 500,
//       message: "Erro ao deletar arquivo do ticket",
//       error: error.message,
//     });
//   }
// };

// const aprovarDocumento = async (req, res) => {
//   try {
//     const documentoCadastral = await DocumentoCadastral.findById(req.params.id);

//     if (!documentoCadastral) {
//       return sendErrorResponse({
//         res,
//         statusCode: 404,
//         message: "Documento Cadastral não encontrado",
//       });
//     }

//     documentoCadastral.statusValidacao = "aprovado";
//     await documentoCadastral.save();

//     return sendResponse({
//       res,
//       statusCode: 200,
//       data: documentoCadastral,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Erro ao aprovar documento",
//       error: error.message,
//     });
//   }
// };

// const reprovarDocumento = async (req, res) => {
//   try {
//     const { motivoRecusa, observacaoInterna, observacaoPrestador } = req.body;
//     const documentoCadastral = await DocumentoCadastral.findById(req.params.id);

//     if (!documentoCadastral) {
//       return sendErrorResponse({
//         res,
//         statusCode: 404,
//         message: "Documento Cadastral não encontrado",
//       });
//     }

//     documentoCadastral.statusValidacao = "recusado";
//     documentoCadastral.motivoRecusa = motivoRecusa;
//     documentoCadastral.observacaoInterna = observacaoInterna;
//     documentoCadastral.observacaoPrestador = observacaoPrestador;
//     await documentoCadastral.save();

//     return sendResponse({
//       res,
//       statusCode: 200,
//       data: documentoCadastral,
//     });
//   } catch (error) {
//     return sendErrorResponse({
//       res,
//       statusCode: 400,
//       message: "Erro ao reprovar documento",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  listar,
  criar,
};
