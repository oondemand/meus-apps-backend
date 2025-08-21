const AuthService = require("../../services/auth");
const Helpers = require("../../utils/helpers");

const login = async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await AuthService.login({ email, senha });

  Helpers.sendResponse({
    res,
    statusCode: 200,
    token: usuario.gerarToken(),
    usuario: {
      _id: usuario._id,
      nome: usuario.nome,
      tipo: usuario.tipo,
    },
  });
};

const validarToken = async (req, res) => {
  // Se passou pelo middleware, `req.usuario` já está preenchido
  Helpers.sendResponse({ res, statusCode: 200, usuario: req.usuario });
};

const autenticarApp = async (req, res) => {
  const tipoAcesso =
    req.usuario.tipo === "master"
      ? "master"
      : req.aplicativo.usuarios.find(
          (item) => item.usuario?.toString() === req.usuario._id?.toString()
        ).tipoAcesso;

  const usuario = {
    _id: req.usuario._id,
    email: req.usuario.email,
    nome: req.usuario?.nome,
    aplicativo: {
      _id: req.aplicativo._id,
      nome: req.aplicativo.nome,
      tipoAcesso,
    },
  };

  Helpers.sendResponse({ res, statusCode: 200, usuario });
};

const primeiroAcesso = async (req, res) => {
  const { usuario, tokenExpirado } = await AuthService.primeiroAcesso({
    body: req.body,
  });

  if (tokenExpirado) {
    return Helpers.sendErrorResponse({
      res,
      statusCode: 401,
      message:
        "Link de autenticação expirado, um novo link foi enviado para o seu email!",
    });
  }

  Helpers.sendResponse({
    res,
    statusCode: 200,
    token: usuario.gerarToken(),
    usuario: {
      _id: usuario._id,
      nome: usuario.nome,
      tipo: usuario.tipo,
    },
  });
};

module.exports = {
  login,
  validarToken,
  primeiroAcesso,
  autenticarApp,
};
