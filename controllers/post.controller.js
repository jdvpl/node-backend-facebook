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
const getAllPost = async (req, res = response) => {
  try {
    const posts = await Post.find().populate("user", [
      "username",
      "first_name",
      "last_name",
      "picture",
      "gender",
    ]);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  createPost,
  getAllPost,
};
