const express = require("express");
const router = express.Router();
const {
  getNotifications,
  createNotification,
  deleteAllNotification,
  updateNotification,
} = require("../controllers/notificationController");
const { isLoggedIn } = require("../middlewares/user");

router
  .route("/notification")
  .get(getNotifications)
  .post(isLoggedIn, updateNotification)
  .delete(isLoggedIn, deleteAllNotification);
router.route("/notification/create").post(isLoggedIn, createNotification);

module.exports = router;
