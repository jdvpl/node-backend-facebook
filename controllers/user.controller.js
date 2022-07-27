const { response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { validateUsername } = require("../helpers/validation");
const { generateJWT } = require("../helpers/generate-jwt");
const { sendEmail } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");

const userGet = async (req, res = response) => {
  const estado = { status: true };
  const { limite = 5, desde = 0 } = req.query;

  const [total, usuarios] = await Promise.all([
    User.countDocuments(estado),
    User.find(estado).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({ total, limite, desde, usuarios });
};
const userRegister = async (req, res = response) => {
  const {
    first_name,
    last_name,
    email,
    password,
    gender,
    bYear,
    bMonth,
    bDay,
  } = req.body;

  try {
    let tempusername = first_name.split(" ")[0] + last_name.split(" ")[0];

    let newusername = await validateUsername(tempusername);
    const user = new User({
      first_name,
      last_name,
      username: newusername,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDay,
    });
    await user.save();

    const url = `${process.env.BASE_URL}/activate/${user.id}`;
    const data = {
      name: first_name,
      email: email,
      url,
    };
    sendEmail(data);
    const token = generateJWT({ id: user.id.toString() }, "15d");
    return res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: token,
      verified: user.verified,
      isAdmin: user.isAdmin,
      picture: user.picture,
      msg: "Register success ! Please activate your email to start.",
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const activateAccount = async (req, res) => {
  const { token } = req.body;
  try {
    const check = await User.findById(token);
    if (check.verified) {
      return res.status(400).json({ msg: "This email is already activated." });
    } else {
      await User.findByIdAndUpdate(token, { verified: true });
      return res
        .status(200)
        .json({ msg: "Account has been activated successfully." });
    }
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(404).json({
        msg: "Invalid Password",
      });
    }
    // generar el JWT
    const token = await generateJWT({ id: user.id }, "7d");
    return res.json({
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: token,
      verified: user.verified,
      isAdmin: user.isAdmin,
      picture: user.picture,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const sendVerification = async (req, res) => {
  const { user } = req;

  try {
    const userd = await User.findById(user.id);
    if (userd.verified) {
      return res
        .status(400)
        .json({ msg: "This account is already activated." });
    }
    const url = `${process.env.BASE_URL}/activate/${user.id}`;
    const data = {
      name: user.first_name,
      email: user.email,
      url,
    };
    sendEmail(data);
    return res
      .status(200)
      .json({ msg: "Email verification link has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  userGet,
  userRegister,
  activateAccount,
  login,
  sendVerification,
};
