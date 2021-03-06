const BigPromise = require("./bigPromise");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const customError = require("../utils/customError");
const jwt = require("jsonwebtoken");
const { UserNotification } = require("../utils/getNotification");

exports.isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.json({ success: false, message: "Please Login First" });

  const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(decode.id)
    .populate("following")
    .populate("followers")
    .populate("posts")
    .populate("likedPosts")
    .populate("bookmarkedPosts")
    .populate("archivePosts")
    .populate("notification")
    .populate("notification.fromUser")
    .populate("notification.post");

  const allNotifications = await Notification.find()
    .populate("fromUser")
    .populate("post")
    .populate("toUser");

  const userNotification = UserNotification(user._id, allNotifications);

  user.notification = userNotification;

  req.user = user;

  next();
};

exports.isUserVerified = async (req, res, next) => {
  const code = req.cookies.userVerify;

  if (!code) return res.json({ success: false, message: "Invalid Code !" });

  const user = await User.findOne({
    code,
    forgotPasswordExpiry: { $gt: Date.now() },
  })
    .select("+password")
    .populate("following")
    .populate("followers")
    .populate("posts")
    .populate("likedPosts")
    .populate("bookmarkedPosts")
    .populate("archivePosts")
    .populate("notification");
  req.user = user;

  next();
};

exports.isRoleAdmissible = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(400).send("User not admissible for this information.");

    next();
  };
};
