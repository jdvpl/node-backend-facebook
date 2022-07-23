const User = require("../models/user");

const validateUsername = async (username = "") => {
  let a = false;
  do {
    const existsUser = await User.findOne({ username });
    if (existsUser) {
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};

module.exports = { validateUsername };
