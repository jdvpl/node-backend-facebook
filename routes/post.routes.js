const { Router } = require("express");
const { check } = require("express-validator");
const { createPost } = require("../controllers/post.controller");

const {} = require("../controllers/user.controller");
const { existsEmail, noExisteCorreo } = require("../helpers/db-validators");
const { checkAuth } = require("../middlewares/check-auth");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/",
  [
    checkAuth,
    check("user", "User Id is invalid").isMongoId(),
    check("user", "Id is required").not().isEmpty(),
    // check("text", "Text is required").not().isEmpty(),
    // check("type", "Type is required").not().isEmpty(),
    validarCampos,
  ],
  createPost
);

module.exports = router;
