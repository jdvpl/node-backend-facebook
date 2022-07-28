const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const CodeSchema = Schema({
  code: {
    type: Number,
    required: [true, "Number code is required"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

CodeSchema.methods.toJSON = function () {
  const { __v, _id, ...code } = this.toObject();
  code.id = _id;
  return code;
};

module.exports = model("Code", CodeSchema);
