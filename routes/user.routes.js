const { Router } = require("express");
const { userGet } = require("../controllers/user.controller");

const router = Router();

router.get("/", userGet);

module.exports = router;
