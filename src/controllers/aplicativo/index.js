const Sistema = require("../../models/Sistema");
const AplicativoService = require("../../services/aplicativo");
const Helpers = require("../../utils/helpers");

// const emailUtils = require("../../utils/emailUtils");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

const criarAplicativo = async (req, res) => {
  const aplicativo = await AplicativoService.criar({ aplicativo: req.body });
  Helpers.sendResponse({ res, statusCode: 201, aplicativo });
};

const buscarPorId = async (req, res) => {
  const aplicativo = await AplicativoService.obterPorId({
    id: req.params.id,
  });

  Helpers.sendResponse({ res, statusCode: 200, aplicativo });
};

const atualizarAplicativo = async (req, res) => {
  const aplicativo = await AplicativoService.atualizar({
    id: req.params.id,
    aplicativo: req.body,
  });

  Helpers.sendResponse({ res, statusCode: 200, aplicativo });
};

const deletarAplicativo = async (req, res) => {
  const aplicativo = await AplicativoService.deletar({ id: req.params.id });
  Helpers.sendResponse({ res, statusCode: 200, aplicativo });
};

const listarTodos = async (req, res) => {
  const aplicativos = await AplicativoService.listar({ usuario: req.usuario });
  Helpers.sendResponse({ res, statusCode: 200, aplicativos });
};

const convidarUsuario = async (req, res) => {
  await AplicativoService.convidarUsuario({
    email: req?.body?.email,
    tipoAcesso: req?.body?.tipoAcesso,
    id: req?.params?.id,
  });

  Helpers.sendResponse({ res, statusCode: 200 });
};

const acessarAplicativo = async (req, res) => {
  const { appId } = req.query;
  const { usuario, aplicativo } = await AplicativoService.acessarAplicativo({
    appId,
    userId: req.usuario?._id,
  });

  const token = usuario.gerarToken();

  Helpers.sendResponse({
    res,
    statusCode: 200,
    redirect: `${aplicativo.url}?code=${token}`,
  });
};

const acessarAssistente = async (req, res) => {
  const { appId } = req.query;
  const sistemaConfig = await Sistema.findOne();

  const app = await AplicativoService.obterPorAppKey({
    appKey: sistemaConfig.assistentes.appKey,
  });

  const { usuario, aplicativo } = await AplicativoService.acessarAplicativo({
    appId,
    userId: req.usuario?._id,
  });

  const token = usuario.gerarToken();

  Helpers.sendResponse({
    res,
    statusCode: 200,
    redirect: `${app.url}/assistentes?code=${token}&searchTerm=${aplicativo._id}`,
  });
};

module.exports = {
  listarTodos,
  buscarPorId,
  criarAplicativo,
  convidarUsuario,
  deletarAplicativo,
  acessarAplicativo,
  atualizarAplicativo,
  acessarAssistente,
};
