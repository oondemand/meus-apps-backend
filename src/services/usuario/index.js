const Usuario = require("../../models/Usuario");
// const CredenciaisInvalidasError = require("../errors/usuario/credenciaisInvalidas");
const UsuarioNaoEncontradoError = require("../errors/usuario/usuarioNaoEncontrado");
const bcrypt = require("bcryptjs");
const FiltersUtils = require("../../utils/pagination/filter");
const PaginationUtils = require("../../utils/pagination");
const Aplicativo = require("../../models/Aplicativo");

const criar = async ({ usuario }) => {
  const novoUsuario = new Usuario(usuario);
  return await novoUsuario.save();
};

const atualizar = async ({ id, usuario }) => {
  const usuarioExistente = await Usuario.findById(id);
  if (!usuarioExistente) return new UsuarioNaoEncontradoError();

  Object.assign(usuarioExistente, usuario);
  await usuarioExistente.save();

  return usuarioExistente;
};

const deletar = async ({ id }) => {
  const usuarioDeletado = await Usuario.findByIdAndDelete(id);
  if (!usuarioDeletado) throw new UsuarioNaoEncontradoError();

  // Remove o usuário deletado dos aplicativos
  await Aplicativo.updateMany(
    { "usuarios.usuario": id },
    { $pull: { usuarios: { usuario: id } } }
  );

  return usuarioDeletado;
};

// const buscarUsuarioPorId = async ({ id }) => {
//   const usuario = await Usuario.findById(id);
//   if (!usuario || !id) throw new UsuarioNaoEncontradoError();
//   return usuario;
// };

const buscarUsuarioPorEmail = async ({ email }) => {
  const usuario = await Usuario.findOne({ email });
  if (!usuario) throw new UsuarioNaoEncontradoError();
  return usuario;
};

const listarComPaginacao = async ({
  pageIndex,
  pageSize,
  searchTerm,
  filtros,
  ...rest
}) => {
  const schema = Usuario.schema;
  const camposBusca = ["status", "nome", "email", "tipo", "telefone"];

  const query = FiltersUtils.buildQuery({
    filtros,
    schema,
    searchTerm,
    camposBusca,
  });

  const { page, limite, skip } = PaginationUtils.buildPaginationQuery({
    pageIndex,
    pageSize,
  });

  const [usuarios, totalDeUsuarios] = await Promise.all([
    Usuario.find({
      $and: [{ status: { $ne: "arquivado" } }, ...query],
    })
      .skip(skip)
      .limit(limite)
      .populate("aplicativos aplicativos.aplicativo"),
    Usuario.countDocuments({
      $and: [{ status: { $ne: "arquivado" } }, ...query],
    }),
  ]);

  return { usuarios, totalDeUsuarios, page, limite };
};

module.exports = {
  criar,
  // login,
  deletar,
  atualizar,
  // buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  listarComPaginacao,
};
