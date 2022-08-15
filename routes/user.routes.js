const { Router } = require("express");
const { check } = require("express-validator");

const {
  userGet,
  userRegister,
  activateAccount,
  login,
  sendVerification,
  findUser,
  sendCodeVerification,
  validateCode,
  changePassword,
  getProfile,
  updateProfilePicture,
  updateCoverPicture,
} = require("../controllers/user.controller");
const { existsEmail, noExisteCorreo } = require("../helpers/db-validators");
const { checkAuth } = require("../middlewares/check-auth");
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
router.get("/", checkAuth, userGet);
router.post(
  "/activate",

  [
    checkAuth,
    check("token", "Token is required").not().isEmpty(),
    validarCampos,
  ],
  activateAccount
);

// get login
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check("email").custom(noExisteCorreo),
    validarCampos,
  ],
  login
);

router.get("/sendVerification", checkAuth, sendVerification);
router.post(
  "/findUser",
  [
    check("email", "Email is required").isEmail(),
    check("email").custom(noExisteCorreo),
    validarCampos,
  ],
  findUser
);
router.post(
  "/sendCode",
  [
    check("email", "Email is required").isEmail(),
    check("email").custom(noExisteCorreo),
    validarCampos,
  ],
  sendCodeVerification
);
router.post(
  "/validateCode",
  [
    check("id", "Id is invalid").isMongoId(),
    check("id", "Id is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    validarCampos,
  ],
  validateCode
);
router.put(
  "/changePassword",
  [
    check("email", "Email is required").isEmail(),
    check("email").custom(noExisteCorreo),
    check("password", "Code is required").not().isEmpty(),
    validarCampos,
  ],
  changePassword
);

router.get(
  "/getProfile/:username",
  [
    checkAuth,
    check("username", "Username is required").not().isEmpty(),
    validarCampos,
  ],
  getProfile
);
router.put(
  "/updateProfilePicture",
  [
    checkAuth,
    check("url", "Url picture is required").not().isEmpty(),
    validarCampos,
  ],
  updateProfilePicture
);
router.put(
  "/updateCover",
  [
    checkAuth,
    check("url", "Url picture is required").not().isEmpty(),
    validarCampos,
  ],
  updateCoverPicture
);

module.exports = router;
