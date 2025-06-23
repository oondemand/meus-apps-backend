const express = require("express");
const PlanejamentoController = require("../controllers/planejamento");
// const {
//   listarServicos,
// } = require("../controllers/planejamentoController/listarServicos");
// const {
//   estatisticas,
// } = require("../controllers/planejamentoController/estatisticas");

const router = express.Router();

router.get("/listar-servicos", PlanejamentoController.listar);
// router.get("/estatisticas", estatisticas);
// router.post("/sincronizar-esteira", sincronizarEsteira);

module.exports = router;
