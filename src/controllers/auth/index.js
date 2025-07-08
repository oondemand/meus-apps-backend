const AuthService = require("../../services/auth");
const Helpers = require("../../utils/helpers");

const login = async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await AuthService.login({ email, senha });

  Helpers.sendResponse({
    res,
    statusCode: 200,
    token: usuario.gerarToken(),
    usuario: {
      _id: usuario._id,
      nome: usuario.nome,
      tipo: usuario.tipo,
    },
  });
};

const validarToken = async (req, res) => {
  // Se passou pelo middleware, `req.usuario` já está preenchido
  Helpers.sendResponse({ res, statusCode: 200, usuario: req.usuario });
};

module.exports = {
  login,
  validarToken,
};
