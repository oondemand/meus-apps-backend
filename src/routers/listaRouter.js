const express = require("express");
const router = express.Router();
const ListaController = require("../controllers/lista");
const { asyncHandler } = require("../utils/helpers");

router.post("/", asyncHandler(ListaController.createLista));
router.get("/", asyncHandler(ListaController.getListas));
router.get("/:codigo", asyncHandler(ListaController.getListaPorCodigo));
router.post("/:id/", asyncHandler(ListaController.addItem));
router.delete("/:id/:itemId", asyncHandler(ListaController.removeItem));
router.put("/:id", asyncHandler(ListaController.updateItem));

module.exports = router;
