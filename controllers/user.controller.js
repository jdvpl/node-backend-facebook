const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const userGet = async (req, res = response) => {
  const estado = { status: true };
  const { limite = 5, desde = 0 } = req.query;

  const [total, usuarios] = await Promise.all([
    User.countDocuments(estado),
    User.find(estado).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({ total, limite, desde, usuarios });
};

module.exports = {
  userGet,
};
