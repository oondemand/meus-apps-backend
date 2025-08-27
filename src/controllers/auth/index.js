const Sistema = require("../../models/Sistema");
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
  let tipoAcesso = "padrao";

  if (req.usuario.tipo === "master") {
    tipoAcesso = "master";
  }

  if (!req.acessoLiberado && req.usuario.tipo !== "master") {
    tipoAcesso = req.aplicativo.usuarios.find((item) => {
      return item.usuario?._id?.toString() === req.usuario._id?.toString();
    }).tipoAcesso;
  }

  const usuario = {
    _id: req.usuario._id,
    email: req.usuario.email,
    nome: req.usuario?.nome,
    editarAssistente:
      req.usuario.tipo === "master" ? true : req.usuario?.editarAssistente,
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

const esqueciMinhaSenha = async (req, res) => {
  const { email } = req.body;
  await AuthService.esqueciMinhaSenha({ email });

  Helpers.sendResponse({
    res,
    statusCode: 200,
    message: "Email enviado",
  });
};

const alterarSenha = async (req, res) => {
  const usuario = await AuthService.alterarSenha({
    code: req?.body?.code,
    novaSenha: req?.body?.novaSenha,
    confirmacao: req?.body?.confirmacao,
  });

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
  alterarSenha,
  validarToken,
  autenticarApp,
  primeiroAcesso,
  esqueciMinhaSenha,
};
