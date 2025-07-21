const Aplicativo = require("../models/Aplicativo");
const Helpers = require("../utils/helpers");

const authAplicativo = async (req, res, next) => {
  const origin = req.headers.origin;

  if (!origin) {
    return Helpers.sendErrorResponse({
      res,
      message: "Acesso negado. Aplicativo inválido!",
      statusCode: 401,
    });
  }

  try {
    let aplicativo = await Aplicativo.findOne({
      appKey: origin,
      "usuarios.usuario": req.usuario._id,
    });

    if (!aplicativo && req.usuario.tipo === "master") {
      aplicativo = await Aplicativo.findOne({
        appKey: origin,
      });
    }

    if (!aplicativo) {
      return Helpers.sendErrorResponse({
        res,
        statusCode: 401,
        message: "Usuário não tem permissão para acessar esse aplicativo!",
      });
    }

    req.aplicativo = aplicativo;
    next();
  } catch (error) {
    return Helpers.sendErrorResponse({
      res,
      statusCode: 401,
      message: "Erro na validação do aplicativo!",
      error: error?.message ?? error,
    });
  }
};

module.exports = authAplicativo;
