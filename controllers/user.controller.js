const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validateUsername } = require("../helpers/validation");

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
    user_name,
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
      user_name: newusername,
      email,
      password,
      gender,
      bYear,
      bMonth,
      bDay,
    });
    await user.save();
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  userGet,
  userRegister,
};
