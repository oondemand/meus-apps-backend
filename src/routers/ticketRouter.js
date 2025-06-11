const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticket");
const multer = require("multer");

const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");

const storage = multer.memoryStorage({});

const fileFilter = (req, file, cb) => {
  return cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Limite de 1MB por arquivo
});

// router.post(
//   "/:id/upload",
//   upload.array("arquivos", 10),
//   TicketController.uploadFiles
// );

// router.get("/:id/arquivos", TicketController.listFilesFromTicket);
// router.delete("/arquivo/:ticketId/:id", TicketController.deleteFileFromTicket);
// router.get("/arquivo/:id", TicketController.getArquivoPorId);

router.post(
  "/",
  registrarAcaoMiddleware({
    acao: ACOES.ADICIONADO,
    entidade: ENTIDADES.TICKET,
  }),
  TicketController.createTicket
);

router.get("/", TicketController.getAllTickets);
// router.get("/arquivados", TicketController.getArchivedTickets);
// router.get("/pagos", TicketController.getTicketsPago);

// router.get(
//   "/usuario-prestador/:usuarioId",
//   TicketController.getTicketsByUsuarioPrestador
// );
// router.get("/:id", TicketController.getTicketById);

// router.post(
//   "/arquivar/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.ARQUIVADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.arquivarTicket
// );

// router.patch(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.updateTicket
// );

// router.delete(
//   "/:id",
//   registrarAcaoMiddleware({
//     acao: ACOES.DELETADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.deleteTicket
// );

// router.post(
//   "/adicionar-servico/:ticketId/:servicoId/",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.addServico
// );

// router.post(
//   "/remover-servico/:servicoId",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.removeServico
// );

// router.post(
//   "/adicionar-documento-fiscal/:ticketId/:documentoFiscalId/",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.addDocumentoFiscal
// );

// router.post(
//   "/remover-documento-fiscal/:documentoFiscalId",
//   registrarAcaoMiddleware({
//     acao: ACOES.ALTERADO,
//     entidade: ENTIDADES.TICKET,
//   }),
//   TicketController.removeDocumentoFiscal
// );

module.exports = router;
