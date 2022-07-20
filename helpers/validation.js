const User = require("../models/user");

const validateUsername = async (user_name = "") => {
  let a = false;
  do {
    const existsUser = await User.findOne({ user_name });
    if (existsUser) {
      user_name += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return user_name;
};

module.exports = { validateUsername };
