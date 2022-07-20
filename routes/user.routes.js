const { Router } = require("express");
const { check } = require("express-validator");

const { userGet, userRegister } = require("../controllers/user.controller");
const { existsEmail } = require("../helpers/db-validators");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/register",
  [
    check("first_name", "First name is required").not().isEmpty(),
    check("first_name", "First name must between 3 and 30 characters").isLength(
      {
        min: 3,
        max: 30,
      }
    ),
    check("last_name", "Last name is required").not().isEmpty(),
    check("last_name", "Last name must between 3 and 30 characters").isLength({
      min: 3,
      max: 30,
    }),
    check("email", "email is required").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("email").custom(existsEmail),
    check("password", "password is required").not().isEmpty(),
    check("password", "password must be at least 6 characters").isLength({
      min: 6,
      max: 40,
    }),
    validarCampos,
  ],
  userRegister
);
router.get("/", userGet);

module.exports = router;
