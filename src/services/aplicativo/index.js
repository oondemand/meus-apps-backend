const Aplicativo = require("../../models/Aplicativo");
const Sistema = require("../../models/Sistema");
const Usuario = require("../../models/Usuario");
const { emailPrimeiroAcesso } = require("../../utils/emailUtils");

const AplicativoNaoEncontradoError = require("../errors/aplicativo/aplicativoNaoEncontrado");
const UsuarioNaoEncontradoError = require("../errors/usuario/usuarioNaoEncontrado");

const criar = async ({ aplicativo }) => {
  const novoAplicativo = new Aplicativo(aplicativo);
  return await novoAplicativo.save();
};

const deletar = async ({ id }) => {
  const aplicativoDeletado = await Aplicativo.findByIdAndDelete(id);
  if (!aplicativoDeletado) throw new AplicativoNaoEncontradoError();

  // Remove o aplicativo deletado dos usuários
  await Usuario.updateMany(
    { "aplicativos.aplicativo": id },
    { $pull: { aplicativos: { aplicativo: id } } }
  );

  return aplicativoDeletado;
};

const listar = async ({ usuario }) => {
  const usuarioExistente = await Usuario.findById(usuario);
  if (!usuarioExistente) throw new UsuarioNaoEncontradoError();

  const sistema = await Sistema.findOne();

  if (usuario.tipo === "master") {
    const aplicativos = await Aplicativo.find({
      appKey: { $ne: sistema.assistentes.appKey },
    });
    return aplicativos;
  }

  const aplicativos = await Aplicativo.find({
    "usuarios.usuario": usuarioExistente._id,
    appKey: { $ne: sistema.assistentes.appKey },
  });

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
  const aplicativo = await Aplicativo.findById(id).populate(
    "usuarios usuarios.usuario"
  );
  if (!aplicativo) throw new AplicativoNaoEncontradoError();
  return aplicativo;
};

const obterPorAppKey = async ({ appKey }) => {
  const aplicativo = await Aplicativo.findOne({ appKey });
  if (!aplicativo) throw new AplicativoNaoEncontradoError();
  return aplicativo;
};

const convidarUsuario = async ({ email, tipoAcesso = "padrao", id }) => {
  const aplicativo = await Aplicativo.findById(id);
  if (!aplicativo) throw new AplicativoNaoEncontradoError();

  let usuario = await Usuario.findOne({ email });

  if (!usuario) {
    usuario = new Usuario({
      email,
      senha: "123456",
      aplicativos: [{ aplicativo: id, tipoAcesso }],
    });

    await usuario.save();

    await Aplicativo.findByIdAndUpdate(id, {
      $addToSet: { usuarios: { usuario: usuario._id, tipoAcesso } },
    });

    const token = usuario.gerarToken({ aplicativo: id });
    const url = new URL("/first-login", process.env.BASE_CLIENT_URL);
    url.searchParams.append("code", token);

    console.log("🟨 [CONVITE ENVIADO] URL", url.toString());

    await emailPrimeiroAcesso({ usuario, url });
    return await Aplicativo.findById(id).populate("usuarios.usuario");
  }

  const vinculado = usuario.aplicativos.some((a) => a.aplicativo.equals(id));

  if (!vinculado) {
    usuario.aplicativos.push({ aplicativo: id, tipoAcesso });
    await usuario.save();

    await Aplicativo.findByIdAndUpdate(id, {
      $addToSet: { usuarios: { usuario: usuario._id, tipoAcesso } },
    });
  }

  return await Aplicativo.findById(id).populate("usuarios.usuario");
};

const acessarAplicativo = async ({ appId, userId }) => {
  const usuario = await Usuario.findById(userId);
  if (!usuario) throw new UsuarioNaoEncontradoError();
  const aplicativo = await Aplicativo.findById(appId);
  if (!aplicativo) throw new AplicativoNaoEncontradoError();

  return { usuario, aplicativo };
};

module.exports = {
  criar,
  listar,
  deletar,
  atualizar,
  obterPorId,
  obterPorAppKey,
  convidarUsuario,
  acessarAplicativo,
};
