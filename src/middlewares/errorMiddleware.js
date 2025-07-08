const multer = require("multer");
const Helpers = require("../utils/helpers");
const GenericError = require("../services/errors/generic");

const errorMiddleware = (error, _, res, next) => {
  if (!error) return next();

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return Helpers.sendErrorResponse({
        res,
        status: 513,
        error: error.message,
        message: "O arquivo enviado excede o tamanho máximo permitido!",
      });
    }

    return Helpers.sendErrorResponse({
      res,
      statusCode: 500,
      error: error.message,
      message: "Houve um erro inesperado!",
    });
  }

  if (error instanceof GenericError) {
    return Helpers.sendErrorResponse({
      res,
      statusCode: error.statusCode,
      error: error.details,
      message: error.message,
    });
  }

  return Helpers.sendErrorResponse({
    res,
    statusCode: 500,
    error: error.message,
    message: "Houve um erro inesperado!",
  });
};

module.exports = errorMiddleware;
