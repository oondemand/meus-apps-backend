const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const Helpers = require("../utils/helpers");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return Helpers.sendErrorResponse({
      res,
      message: "Acesso negado. Token ausente!",
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = await Usuario.findById(decoded.id).select("-senha");
    if (!req.usuario) {
      return Helpers.sendErrorResponse({
        res,
        statusCode: 401,
        message: "Usuario não encontrado!",
      });
    }

    next();
  } catch (error) {
    return Helpers.sendErrorResponse({
      res,
      statusCode: 401,
      error: error?.message ?? error,
      message: "Token inválido!",
    });
  }
};

module.exports = authMiddleware;
