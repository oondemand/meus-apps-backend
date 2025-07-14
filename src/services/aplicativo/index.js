const Aplicativo = require("../../models/Aplicativo");
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
  return aplicativoDeletado;
};

const listar = async ({ usuario }) => {
  const usuarioExistente = await Usuario.findById(usuario);
  if (!usuarioExistente) throw new UsuarioNaoEncontradoError();

  if (usuario.tipo === "master") {
    const aplicativos = await Aplicativo.find();
    return aplicativos;
  }

  const aplicativos = await Aplicativo.find({
    "usuarios.usuario": usuarioExistente._id,
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

const convidarUsuario = async ({ email, tipoAcesso = "padrão", id }) => {
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

    const token = usuario.gerarToken();
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

module.exports = {
  criar,
  listar,
  deletar,
  atualizar,
  obterPorId,
  convidarUsuario,
};
