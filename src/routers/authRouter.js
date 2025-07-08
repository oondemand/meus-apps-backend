const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");
const authMiddleware = require("../middlewares/authMiddleware");
const { asyncHandler } = require("../utils/helpers");

router.post("/login", asyncHandler(AuthController.login));
router.get(
  "/validar-token",
  authMiddleware,
  asyncHandler(AuthController.validarToken)
);

module.exports = router;
