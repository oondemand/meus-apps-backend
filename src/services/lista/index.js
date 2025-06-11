const Lista = require("../../models/Lista");
const GenericError = require("../errors/generic");
const ListaNaoEncontradaError = require("../errors/lista/listaNaoEncontrada");

const create = async ({ codigo }) => {
  const novaLista = new Lista({ codigo, data: [] });
  return await novaLista.save();
};

const addItem = async ({ id, valor }) => {
  const lista = await Lista.findById(id).populate("data");
  if (!lista) throw new ListaNaoEncontradaError();
  lista.data.push({ valor });
  return await lista.save();
};

const removeItem = async ({ id, itemId }) => {
  const lista = await Lista.findById(id).populate("data");
  lista.data = lista.data.filter((item) => item._id != itemId);
  await lista.save();
  return lista;
};

const obterListas = async () => {
  const listas = await Lista.aggregate([
    { $addFields: { data: { $reverseArray: "$data" } } },
  ]);

  return listas;
};

const obterListaPorCodigo = async ({ codigo }) => {
  const lista = await Lista.findOne({ codigo });
  if (!lista || !codigo) throw new ListaNaoEncontradaError();
  lista.data = lista.data.filter((item) => item.valor);
  return lista;
};

const atualizarItem = async ({ id, itemId, valor }) => {
  const lista = await Lista.findById(id).populate("data");
  if (!lista) throw new ListaNaoEncontradaError();

  const index = lista.data.findIndex((item) => item._id == itemId);
  if (index === -1) return new GenericError("Item não encontrado", 404);

  const trimmedValor = valor.trim();

  const valorExistente = lista.data.some((item) => item.valor === trimmedValor);

  if (valorExistente) return new GenericError("Valor já existe na lista", 409);

  if (valor) lista.data[index].valor = valor;
  await lista.save();

  return lista;
};

module.exports = {
  create,
  addItem,
  removeItem,
  obterListas,
  atualizarItem,
  obterListaPorCodigo,
};
