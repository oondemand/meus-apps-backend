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

const atualizar = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.atualizar({
    id: req.params.id,
    documentoCadastral: req.body,
  });

  return sendResponse({
    res,
    statusCode: 200,
    documentoCadastral,
  });
};

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

const excluir = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.excluir({
    id: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoCadastral,
  });
};

const anexarArquivo = async (req, res) => {
  const arquivo = await DocumentoCadastralService.anexarArquivo({
    arquivo: req.file,
    id: req.params.documentoCadastralId,
  });

  return sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const removerArquivo = async (req, res) => {
  const arquivo = await DocumentoCadastralService.removerArquivo({
    id: req.params.documentoCadastralId,
    arquivoId: req.params.id,
  });

  return sendResponse({
    res,
    statusCode: 200,
    arquivo,
  });
};

const aprovarDocumento = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.atualizar({
    id: req.params.id,
    documentoCadastral: { statusValidacao: "aprovado" },
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoCadastral,
  });
};

const reprovarDocumento = async (req, res) => {
  const documentoCadastral = await DocumentoCadastralService.atualizar({
    id: req.params.id,
    documentoCadastral: { ...req.body, statusValidacao: "recusado" },
  });

  return sendResponse({
    res,
    statusCode: 200,
    data: documentoCadastral,
  });
};

module.exports = {
  criar,
  listar,
  excluir,
  atualizar,
  anexarArquivo,
  removerArquivo,
  aprovarDocumento,
  reprovarDocumento,
};
