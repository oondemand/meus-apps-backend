const { default: mongoose } = require("mongoose");
const Aplicativo = require("../models/Aplicativo");
const Helpers = require("../utils/helpers");
const Sistema = require("../models/Sistema");

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
      "usuarios.usuario": new mongoose.Types.ObjectId(req.usuario._id),
    });

    const sistema = await Sistema.findOne({});
    const aplicativosComAcessoLivre = [
      sistema.assistentes?.appKey,
      sistema.suporte?.appKey,
    ];

    if (aplicativosComAcessoLivre.includes(origin)) {
      aplicativo = await Aplicativo.findOne({
        appKey: origin,
      });
    }

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
    req.acessoLiberado = aplicativosComAcessoLivre.includes(origin);
    next();
  } catch (error) {
    console.log(error);

    return Helpers.sendErrorResponse({
      res,
      statusCode: 401,
      message: "Erro na validação do aplicativo!",
      error: error?.message ?? error,
    });
  }
};

module.exports = authAplicativo;
