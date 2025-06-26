const ArquivoNaoEncontradoError = require("../errors/arquivo/arquivoNaoEncontradoError");
const Arquivo = require("../../models/Arquivo");

const obterPorId = async ({ id }) => {
  const arquivo = await Arquivo.findById(id);
  if (!arquivo || !id) throw new ArquivoNaoEncontradoError();
  return arquivo;
};

module.exports = {
  obterPorId,
};
