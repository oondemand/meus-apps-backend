const bcrypt = require("bcryptjs");
const UsuarioService = require("../usuario");
const CredenciaisInvalidasError = require("../errors/auth/credenciaisInvalidas");
const GenericError = require("../errors/generic");
const Usuario = require("../../models/Usuario");
const jwt = require("jsonwebtoken");
const {
  emailPrimeiroAcesso,
  emailEsqueciMinhaSenha,
} = require("../../utils/emailUtils");

const login = async ({ email, senha }) => {
  const usuario = await UsuarioService.buscarUsuarioPorEmail({ email });
  if (!(await bcrypt.compare(senha, usuario.senha)))
    throw new CredenciaisInvalidasError();
  return usuario;
};

const primeiroAcesso = async ({ body }) => {
  if (!body.code)
    throw new GenericError(
      "Você não tem permissão para realizar essa operação, o link de primeiro acesso pode estar inválido",
      401
    );

  const decoded = jwt.decode(body.code, process.env.JWT_SECRET);
  const usuario = await Usuario.findById(decoded.id);

  if (!usuario) throw new GenericError("Usuário não encontrado", 401);

  try {
    jwt.verify(body.code, process.env.JWT_SECRET);
    Object.assign(usuario, { ...body, status: "ativo" });
    await usuario.save();

    return { usuario, tokenExpirado: false };
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError &&
      error.message === "jwt expired"
    ) {
      const token = usuario.gerarToken({ aplicativo: decoded.aplicativo });
      const url = new URL("/first-login", process.env.BASE_CLIENT_URL);
      url.searchParams.append("code", token);

      emailPrimeiroAcesso({ usuario, url });
      return { usuario, tokenExpirado: true };
    }

    throw error;
  }
};

const esqueciMinhaSenha = async ({ email }) => {
  const usuario = await UsuarioService.buscarUsuarioPorEmail({ email });

  const token = usuario.gerarToken();

  const url = new URL("/alterar-senha", process.env.BASE_CLIENT_URL);
  url.searchParams.append("code", token);

  await emailEsqueciMinhaSenha({
    usuario,
    url: url.toString(),
  });

  return usuario;
};

const alterarSenha = async ({ code, novaSenha, confirmacao }) => {
  if (!novaSenha)
    throw new GenericError("Nova senha é um campo obrigatório", 404);

  if (!confirmacao)
    throw new GenericError("Confirmação é um campo obrigatório", 404);

  if (novaSenha !== confirmacao)
    throw new GenericError("A confirmação precisa ser igual a senha.", 400);

  const decoded = jwt.verify(code, process.env.JWT_SECRET);

  const usuario = await Usuario.findById(decoded.id);
  usuario.senha = novaSenha;
  return await usuario.save();
};

module.exports = {
  login,
  alterarSenha,
  primeiroAcesso,
  esqueciMinhaSenha,
};
