const express = require("express");
const router = express.Router();

const UsuarioController = require("../controllers/usuario");
const { asyncHandler } = require("../utils/helpers");

router.post("/", asyncHandler(UsuarioController.criarUsuario));
router.put("/:id", asyncHandler(UsuarioController.atualizarUsuario));
router.delete("/:id", asyncHandler(UsuarioController.deletarUsuario));

router.get("/", asyncHandler(UsuarioController.listarUsuarios));

module.exports = router;
