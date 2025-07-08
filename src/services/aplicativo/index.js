const Aplicativo = require("../../models/Aplicativo");
const Usuario = require("../../models/Usuario");

const AplicativoNaoEncontradoError = require("../errors/aplicativo/aplicativoNaoEncontrado");

const criar = async ({ aplicativo }) => {
  const novoAplicativo = new Aplicativo(aplicativo);
  return await novoAplicativo.save();
};

const deletar = async ({ id }) => {
  const aplicativoDeletado = await Aplicativo.findByIdAndDelete(id);
  if (!aplicativoDeletado) throw new AplicativoNaoEncontradoError();
  return aplicativoDeletado;
};

const listar = async () => {
  const aplicativos = await Aplicativo.find();
  return aplicativos;
};

const atualizar = async ({ id, aplicativo }) => {
  const aplicativoAtualizado = await Aplicativo.findByIdAndUpdate(
    id,
    aplicativo,
    { new: true }
  );
  if (!aplicativoAtualizado) throw new AplicativoNaoEncontradoError();
  return aplicativoAtualizado;
};

const obterPorId = async ({ id }) => {
  const aplicativo = await Aplicativo.findById(id).populate("usuarios");
  if (!aplicativo) throw new AplicativoNaoEncontradoError();
  return aplicativo;
};

const convidarUsuario = async ({ email, id }) => {
  const usuarioExistente = await Usuario.findOne({
    email,
  });

  if (!usuarioExistente) {
    const usuario = new Usuario({
      email,
      senha: "123456",
    });

    await usuario.save();

    const aplicativo = await Aplicativo.findByIdAndUpdate(
      id,
      { $addToSet: { usuarios: usuario } },
      { new: true }
    );

    return aplicativo;
  }

  const aplicativo = await Aplicativo.findByIdAndUpdate(
    id,
    { $addToSet: { usuarios: usuarioExistente?._id } },
    { new: true }
  );

  return aplicativo;
};

module.exports = {
  criar,
  listar,
  deletar,
  atualizar,
  obterPorId,
  convidarUsuario,
};
