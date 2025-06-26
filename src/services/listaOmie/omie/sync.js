const BaseOmie = require("../../../models/BaseOmie");
const ListaOmie = require("../../../models/ListaOmie");
const ListaOmieNaoEncontradaError = require("../../errors/listaOmie/listaOmieNaoEncontradaError");
const OmieService = require("../../omie/listasOmie");

const syncWithOmie = async ({ id }) => {
  const baseOmie = await BaseOmie.findOne();
  const listaOmie = await ListaOmie.findByIdAndUpdate(id);

  if (!listaOmie) throw new ListaOmieNaoEncontradaError();

  const data = await OmieService.ListaOmieService({
    call: listaOmie.call,
    url: listaOmie.url,
    baseOmie,
    select: listaOmie.select,
    fields: listaOmie.fields,
  });

  listaOmie.data = data;
  await listaOmie.save();

  return listaOmie;
};

module.exports = {
  syncWithOmie,
};
