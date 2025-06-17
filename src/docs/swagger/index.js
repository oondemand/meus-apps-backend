// swagger.js
const YAML = require("yamljs");
const path = require("path");

const base = YAML.load(path.join(__dirname, "/base.yml"));
const components = YAML.load(path.join(__dirname, "/components.yaml"));
const auth = YAML.load(path.join(__dirname, "/paths/auth.yaml"));
const usuarios = YAML.load(path.join(__dirname, "/paths/usuarios.yaml"));
const pessoas = YAML.load(path.join(__dirname, "/paths/pessoas.yaml"));
const servicos = YAML.load(path.join(__dirname, "/paths/servicos.yaml"));
const assistentes = YAML.load(path.join(__dirname, "/paths/assistentes.yaml"));
const etapas = YAML.load(path.join(__dirname, "/paths/etapas.yaml"));
const importacoes = YAML.load(path.join(__dirname, "/paths/importacoes.yaml"));
const listas = YAML.load(path.join(__dirname, "/paths/listas.yaml"));
const status = YAML.load(path.join(__dirname, "/paths/status.yaml"));
const ativacao = YAML.load(path.join(__dirname, "/paths/ativacao.yaml"));

const controleAlteracao = YAML.load(
  path.join(__dirname, "/paths/controleAlteracao.yaml")
);

base.components = {
  ...components,
};

// Unir paths
base.paths = {
  ...auth,
  ...controleAlteracao,
  ...usuarios,
  ...pessoas,
  ...servicos,
  ...assistentes,
  ...etapas,
  ...importacoes,
  ...listas,
  ...status,
  ...ativacao
};

module.exports = base;
