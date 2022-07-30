const { Router } = require("express");
const { check } = require("express-validator");
const { uploadImages } = require("../controllers/upload.controller");

const {} = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/check-auth");
const { imageUpload } = require("../middlewares/imageUpload");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", [checkAuth, imageUpload], uploadImages);

module.exports = router;
