const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: [true, "Type of notification"],
    enum: {
      values: [
        "Followed_User",
        "Liked_Post",
        "Comment_Post",
        "Replied Comment",
      ],
      message: "Please select the type",
    },
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  commentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
