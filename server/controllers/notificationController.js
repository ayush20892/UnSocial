const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const BigPromise = require("../middlewares/bigPromise");

exports.getNotifications = BigPromise(async (req, res) => {
  const notifications = await Notification.find()
    .populate("fromUser")
    .populate("post")
    .populate("toUser");

  res.status(200).json({
    success: true,
    notifications,
  });
});

exports.createNotification = BigPromise(async (req, res) => {
  const user = req.user;
  const { toUserId, type, postId } = req.body;

  const notificationObject = {
    fromUser: user._id,
    toUser: toUserId,
    type,
    post: postId,
    isRead: false,
  };

  const notification = await Notification.create(notificationObject);

  const toUser = await User.findById(toUserId);

  toUser.notification.push(notification._id.toString());

  await toUser.save();

  res.status(200).json({
    success: true,
  });
});

exports.deleteAllNotification = BigPromise(async (req, res) => {
  const user = req.user;

  user.notification.forEach(async (notification) => {
    const noti = await Notification.findById(notification._id);
    await noti.delete();
  });

  await user.updateOne({ notification: [] });

  res.status(200).json({
    success: true,
  });
});
