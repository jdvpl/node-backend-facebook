const jwt = require("jsonwebtoken");

const generateJWT = (payload, expired) => {
  return jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
    expiresIn: expired,
  });
};

module.exports = { generateJWT };
