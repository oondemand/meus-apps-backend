const { sendResponse } = require("../../utils/helpers");
const { registrarAcao } = require("../../services/controleService");
const { ENTIDADES, ACOES, ORIGENS } = require("../../constants/controleAlteracao");
const ListaService = require("../../services/lista");

const createLista = async (req, res) => {
  const lista = await ListaService.create({ codigo: req.body.codigo });
  sendResponse({ res, statusCode: 201, lista });
};

const addItem = async (req, res) => {
  const lista = await ListaService.addItem({
    id: req.params.id,
    valor: req.body.valor,
  });

  const entidade = Object.entries(ENTIDADES).find(([_, value]) =>
    value.includes(lista.codigo)
  )?.[1];

  registrarAcao({
    acao: ACOES.ADICIONADO,
    entidade: entidade ?? ENTIDADES.CONFIGURACAO_LISTA,
    usuario: req.usuario,
    idRegistro: lista._id,
    dadosAtualizados: lista,
    origem: req.headers["x-origem"] ?? ORIGENS.API,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const removeItem = async (req, res) => {
  const { id, itemId } = req.params;
  const lista = await ListaService.removeItem({ id, itemId });

  const entidade = Object.entries(ENTIDADES).find(([key, value]) =>
    value.includes(lista.codigo)
  )?.[1];

  registrarAcao({
    acao: ACOES.EXCLUIDO,
    entidade: entidade ?? ENTIDADES.CONFIGURACAO_LISTA,
    usuario: req.usuario,
    idRegistro: lista._id,
    dadosAtualizados: lista,
    origem: req.headers["x-origem"] ?? ORIGENS.API,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const getListas = async (req, res) => {
  const listas = await ListaService.obterListas();
  sendResponse({ res, statusCode: 200, listas });
};

const updateItem = async (req, res) => {
  const { id } = req.params;
  const { itemId, valor } = req.body;

  const lista = ListaService.atualizarItem({ id, itemId, valor });
  const entidade = Object.entries(ENTIDADES).find(([key, value]) =>
    value.includes(lista.codigo)
  )?.[1];

  registrarAcao({
    acao: ACOES.ALTERADO,
    entidade: entidade ?? ENTIDADES.CONFIGURACAO_LISTA,
    usuario: req.usuario,
    idRegistro: lista._id,
    dadosAtualizados: lista,
    origem: req.headers["x-origem"] ?? ORIGENS.API,
  });

  sendResponse({ res, statusCode: 200, lista });
};

const getListaPorCodigo = async (req, res) => {
  const lista = await ListaService.obterListaPorCodigo({
    codigo: req.params.codigo,
  });

  sendResponse({ res, statusCode: 200, lista });
};

module.exports = {
  createLista,
  addItem,
  removeItem,
  getListas,
  updateItem,
  getListaPorCodigo,
};
