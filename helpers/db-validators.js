const { request, response } = require("express");
const User = require("../models/User");

const existeCorreo = async (email = "") => {
  // verificar si el correo existe
  const existsEmail = await User.findOne({ email });
  if (existsEmail) {
    throw new Error(`The email ${email} already exists.`);
  }
};
const noExisteCorreo = async (email = "") => {
  // verificar si el correo existe
  const noExistsEmail = await User.findOne({ email });
  if (!noExistsEmail) {
    throw new Error(`The email ${email} does not exist.`);
  }
};
const existeID = async (id = "") => {
  // verificar si el correo existe
  const existsID = await User.findById(id);
  if (!existsID) {
    throw new Error(`The user with id ${id} does not exist.`);
  }
  return true;
};

module.exports = {
  existeCorreo,
  existeID,
  noExisteCorreo,
};
