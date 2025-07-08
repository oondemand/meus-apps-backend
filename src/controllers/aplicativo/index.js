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
  console.log("LOG", req.params.id);

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
  const aplicativos = await AplicativoService.listar();
  Helpers.sendResponse({ res, statusCode: 200, aplicativos });
};

module.exports = {
  criarAplicativo,
  atualizarAplicativo,
  deletarAplicativo,
  listarTodos,
  buscarPorId,
};
