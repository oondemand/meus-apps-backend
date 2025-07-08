const express = require("express");
const router = express.Router();

const AplicativoController = require("../controllers/aplicativo");
const { asyncHandler } = require("../utils/helpers");

router.get("/", asyncHandler(AplicativoController.listarTodos));
router.post("/", asyncHandler(AplicativoController.criarAplicativo));
router.put("/:id", asyncHandler(AplicativoController.atualizarAplicativo));
router.delete("/:id", asyncHandler(AplicativoController.deletarAplicativo));

// router.get("/:id", asyncHandler(AplicativoController.obterAplicativo));

module.exports = router;
