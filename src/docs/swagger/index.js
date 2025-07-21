// swagger.js
const YAML = require("yamljs");
const path = require("path");

const base = YAML.load(path.join(__dirname, "/base.yml"));
const components = YAML.load(path.join(__dirname, "/components.yaml"));
const auth = YAML.load(path.join(__dirname, "/paths/auth.yaml"));
const usuarios = YAML.load(path.join(__dirname, "/paths/usuarios.yaml"));
const aplicativo = YAML.load(path.join(__dirname, "/paths/aplicativo.yaml"));
const sistema = YAML.load(path.join(__dirname, "/paths/sistema.yaml"));

base.components = {
  ...components,
};

// Unir paths
base.paths = {
  ...auth,
  ...usuarios,
  ...aplicativo,
  ...sistema,
};

module.exports = base;
