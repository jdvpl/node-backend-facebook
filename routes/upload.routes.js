const { Router } = require("express");
const { check } = require("express-validator");
const {
  uploadImages,
  listImages,
} = require("../controllers/upload.controller");

const {} = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/check-auth");
const { imageUpload } = require("../middlewares/imageUpload");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/", [checkAuth, imageUpload], uploadImages);
router.post(
  "/listImages",
  [
    checkAuth,
    check("path", "Path is required").not().isEmpty(),
    check("sort", "Sort is required").not().isEmpty(),
    check("max", "max is required").not().isEmpty(),
    validarCampos,
  ],
  listImages
);
module.exports = router;
