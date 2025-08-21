const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const authMiddleware = require("../middlewares/authMiddleware");
const authAplicativo = require("../middlewares/authAplicativo");

const { asyncHandler } = require("../utils/helpers");

router.post("/login", asyncHandler(AuthController.login));

router.get(
  "/validar-token",
  authMiddleware,
  asyncHandler(AuthController.validarToken)
);

router.get(
  "/autenticar-aplicativo",
  authMiddleware,
  authAplicativo,
  asyncHandler(AuthController.autenticarApp)
);

router.post("/primeiro-acesso", asyncHandler(AuthController.primeiroAcesso));

router.post(
  "/esqueci-minha-senha",
  asyncHandler(AuthController.esqueciMinhaSenha)
);

router.post("/alterar-senha", asyncHandler(AuthController.alterarSenha));

module.exports = router;
