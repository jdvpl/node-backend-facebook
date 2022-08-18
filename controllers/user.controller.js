const { response } = require("express");
const bcryptjs = require("bcryptjs");
const { validateUsername } = require("../helpers/validation");
const { generateJWT } = require("../helpers/generate-jwt");
const { sendEmail, sendEmailCode } = require("../helpers/mailer");
const jwt = require("jsonwebtoken");
const { Code, User, Post } = require("../models");
const generateCode = require("../helpers/generateCode");

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

    tempusername = tempusername.toLowerCase();
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

const findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
      username: user.username,
      id: user.id,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const sendCodeVerification = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user.id });
    const code = generateCode(5);
    const codesaved = new Code({
      code,
      user: user.id,
    });

    await codesaved.save();

    const data = {
      name: user.first_name,
      email: user.email,
      code,
    };
    sendEmailCode(data);
    return res
      .status(200)
      .json({ msg: "Emai reset code has been sent to your email." });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const validateCode = async (req, res) => {
  try {
    const { id, code } = req.body;
    console.log(id, code);
    const codeSaved = await Code.findOne({ user: id });
    console.log(codeSaved.code);
    if (codeSaved.code !== code) {
      return res.status(400).json({ msg: "Verification code is wrong." });
    }
    return res.status(200).json({ msg: "Ok" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    user.password = password;
    await user.save();

    return res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ ok: false, message: `This user does not exist.` });
    }
    const posts = await Post.find({ user: user.id })
      .populate("user")
      .sort({ createdAt: "desc" });
    return res.status(200).json({ ...user.toObject(), posts });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;
    const resp = await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    return res.status(200).json(url);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const updateCoverPicture = async (req, res) => {
  try {
    const { url } = req.body;
    const resp = await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    return res.status(200).json(url);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
const updateUserDetails = async (req, res) => {
  try {
    const resp = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: req.body,
      },
      { new: true }
    );
    return res.status(200).json(resp.details);
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
  findUser,
  sendCodeVerification,
  validateCode,
  changePassword,
  getProfile,
  updateProfilePicture,
  updateCoverPicture,
  updateUserDetails,
};
