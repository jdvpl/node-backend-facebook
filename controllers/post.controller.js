const { response } = require("express");
const { Post } = require("../models");

const createPost = async (req, res = response) => {
  try {
    const dataPost = {
      user,
    };
    const post = new Post(req.body);
    return res.json();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createPost,
};
