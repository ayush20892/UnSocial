const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  textContent: {
    type: String,
    maxLength: [300, "Text should not be more than 300 character,"],
  },
  image: {
    id: {
      type: String,
      require: true,
    },
    secure_url: {
      type: String,
      require: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      replies: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          reply: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
