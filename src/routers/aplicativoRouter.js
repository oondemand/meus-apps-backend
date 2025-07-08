const express = require("express");
const router = express.Router();

const AplicativoController = require("../controllers/aplicativo");
const { asyncHandler } = require("../utils/helpers");

router.get("/", asyncHandler(AplicativoController.listarTodos));
router.get("/:id", asyncHandler(AplicativoController.buscarPorId));

router.post("/", asyncHandler(AplicativoController.criarAplicativo));

router.put("/:id", asyncHandler(AplicativoController.atualizarAplicativo));

router.delete("/:id", asyncHandler(AplicativoController.deletarAplicativo));

module.exports = router;
