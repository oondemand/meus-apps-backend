// swagger.js
const YAML = require("yamljs");
const path = require("path");

const base = YAML.load(path.join(__dirname, "/base.yml"));
const components = YAML.load(path.join(__dirname, "/components.yaml"));
const auth = YAML.load(path.join(__dirname, "/paths/auth.yaml"));
const usuarios = YAML.load(path.join(__dirname, "/paths/usuarios.yaml"));
const pessoas = YAML.load(path.join(__dirname, "/paths/pessoas.yaml"));

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
};

module.exports = base;
