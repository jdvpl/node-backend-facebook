const { response } = require("express");
const cloudinary = require("cloudinary");
const { Post } = require("../models");
const { removeTmp } = require("../middlewares/imageUpload");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImages = async (req, res = response) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      images.push(url);
      removeTmp(file.tempFilePath);
    }
    res.json(images);
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
};

const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: `facebook-jdvpl/${path}`,
      },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath);
          return res
            .status(400)
            .json({ msg: `Upload image failed, ${err.message}` });
        }
        resolve({ url: res.secure_url });
      }
    );
  });
};
module.exports = {
  uploadImages,
};
