const { response } = require("express");
const fs = require("fs");

const imageUpload = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).json({ msg: "No files selected" });
    }
    let files = Object.values(req.files).flat();
    files.forEach((file) => {
      if (
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/png" &&
        file.mimetype !== "image/gif" &&
        file.mimetype !== "image/webp"
      ) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ msg: "Unsupported format" });
      }
      if (file.size > 1024 * 1024 * 100) {
        removeTmp(file.tempFilePath);
        return res.status(400).json({ msg: "File size is too large" });
      }
    });
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) console.log(err);
  });
};

module.exports = { imageUpload, removeTmp };
