const { Router } = require("express");
const { check } = require("express-validator");
const { createPost } = require("../controllers/post.controller");

const {} = require("../controllers/user.controller");
const { existsEmail, noExisteCorreo } = require("../helpers/db-validators");
const { checkAuth } = require("../middlewares/check-auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", [checkAuth, validarCampos], createPost);

module.exports = router;
