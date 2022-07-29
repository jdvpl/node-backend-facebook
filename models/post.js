const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const PostSchema = Schema(
  {
    type: {
      type: String,
      enum: ["ProfilePicture", "cover", null],
      default: null,
    },
    text: {
      type: String,
    },
    images: {
      type: Array,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    background: {
      type: String,
    },
    comments: [
      {
        comment: {
          type: String,
        },
        image: {
          type: String,
        },
        commentBy: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        commentAt: {
          type: Date,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

PostSchema.methods.toJSON = function () {
  const { __v, _id, ...code } = this.toObject();
  code.id = _id;
  return code;
};

module.exports = model("Post", PostSchema);
