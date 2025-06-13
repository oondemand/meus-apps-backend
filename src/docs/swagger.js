// swagger.js
const YAML = require("yamljs");
const path = require("path");

const base = YAML.load(path.join(__dirname, "/base.yml"));
const auth = YAML.load(path.join(__dirname, "/paths/auth.yaml"));

// Unir paths
base.paths = {
  ...auth,
};

module.exports = base;
