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

const autenticarApp = async (req, res) => {
  //   NEEDED {
  //   _id: new ObjectId('68753f1a95f44c3314ea0686'),
  //   url: 'https://maikonalexandre.com.br/',
  //   icone: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.czmLDN6ej9Rc_PVgz43BqQHaFf%3Fpid%3DApi&f=1&ipt=211623933a98970cf4393ea24a8b8281b87db130f07803646198cd7d097d68cf&ipo=images',
  //   nome: 'Rakuten',
  //   tipoAcessoUrl: 'http://localhost:4001/tipo-acesso',
  //   status: 'ativo',
  //   ambiente: 'prod',
  //   usuarios: [
  //     {
  //       usuario: new ObjectId('686c1871eb6fce81cc217cb0'),
  //       tipoAcesso: 'padrão',
  //       _id: new ObjectId('6875425495f44c3314ea077c')
  //     },
  //     {
  //       usuario: new ObjectId('68754446ac54e2ad38d8ba6e'),
  //       tipoAcesso: 'prestador',
  //       _id: new ObjectId('68754446ac54e2ad38d8ba71')
  //     }
  //   ],
  //   __v: 0,
  //   appKey: 'oon_m2-fkiY5G4'
  // } {
  //   _id: new ObjectId('686c1871eb6fce81cc217cb0'),
  //   tipo: 'master',
  //   email: 'maikonalexandre574@gmail.com',
  //   nome: 'Maikon',
  //   status: 'inativo',
  //   __v: 2,
  //   aplicativos: [
  //     {
  //       aplicativo: new ObjectId('68753f1a95f44c3314ea0686'),
  //       tipoAcesso: 'padrão',
  //       _id: new ObjectId('6875425495f44c3314ea077a')
  //     }
  //   ],
  //   telefone: '(38) 9 91757015'
  // }

  const tipoAcesso =
    req.usuario.tipo === "master"
      ? "master"
      : req.aplicativo.usuarios.find((item) => item._id === req.usuario._id)
          .tipoAcesso;

  const usuario = {
    _id: req.usuario._id,
    email: req.usuario.email,
    nome: req.usuario?.nome,
    aplicativo: {
      _id: req.aplicativo._id,
      nome: req.aplicativo.nome,
      tipoAcesso,
    },
  };

  // console.log("NEEDED", req.aplicativo, req.usuario);

  Helpers.sendResponse({ res, statusCode: 200, usuario });
};

const primeiroAcesso = async (req, res) => {
  const usuario = await AuthService.primeiroAcesso({ body: req.body });

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

module.exports = {
  login,
  validarToken,
  primeiroAcesso,
  autenticarApp,
};
