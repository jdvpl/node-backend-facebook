const { response } = require("express");
const { Post } = require("../models");

const createPost = async (req, res = response) => {
  try {
    const post = new Post(req.body);
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createPost,
};
