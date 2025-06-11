const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuario");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registrarAcaoMiddleware,
} = require("../middlewares/registrarAcaoMiddleware");
const { ACOES, ENTIDADES } = require("../constants/controleAlteracao");

router.post("/login", UsuarioController.loginUsuario);
router.get("/validar-token", authMiddleware, UsuarioController.validarToken);

router.post("/esqueci-minha-senha", UsuarioController.esqueciMinhaSenha);

router.post("/alterar-senha", UsuarioController.alterarSenha);
module.exports = router;
