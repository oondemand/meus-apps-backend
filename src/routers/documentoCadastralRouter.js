const express = require("express");
const DocumentoCadastralController = require("../controllers/documentoCadastral");

const router = express.Router();

const { uploadExcel } = require("../config/multer");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");
const { asyncHandler } = require("../utils/helpers");

router.get("/", asyncHandler(DocumentoCadastralController.listar));

// router.get(
//   "/prestador/:prestadorId",
//   DocumentoCadastralController.listarDocumentoCadastralPorPrestador
// );

// router.get(
//   "/prestador",
//   DocumentoCadastralController.listarDocumentoCadastralPorUsuarioPrestador
// );

// router.delete(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.EXCLUIDO,
//     entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
//   }),
//   DocumentoCadastralController.excluirDocumentoCadastral
// );

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
  }),
  asyncHandler(DocumentoCadastralController.criar)
);

// router.post(
//   "/usuario-prestador",
//   upload.single("file"),
//   DocumentoCadastralController.criarDocumentoCadastralPorUsuarioPrestador
// );

// router.post(
//   "/anexar-arquivo/:documentoCadastralId",
//   upload.single("file"),
//   DocumentoCadastralController.anexarArquivo
// );

// router.delete(
//   "/excluir-arquivo/:documentoCadastralId/:id",
//   DocumentoCadastralController.excluirArquivo
// );

// router.patch(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
//   }),
//   DocumentoCadastralController.updateDocumentoCadastral
// );

// router.post(
//   "/aprovar-documento/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.APROVADO,
//     entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
//   }),
//   DocumentoCadastralController.aprovarDocumento
// );

// router.post(
//   "/reprovar-documento/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.REPROVADO,
//     entidade: ENTIDADES.DOCUMENTO_CADASTRAL,
//   }),
//   DocumentoCadastralController.reprovarDocumento
// );

// router.post("/importar", uploadExcel.array("file"), importarDocumentoCadastral);
module.exports = router;
