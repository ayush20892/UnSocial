const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const cloudinary = require("cloudinary").v2;
const BigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const customError = require("../utils/customError");
const mailHelper = require("../utils/mailHelper");
const crypto = require("crypto");
const { extend } = require("lodash");
const validator = require("validator");

exports.signup = BigPromise(async (req, res) => {
  const { name, userName, email, password } = req.body;

  if (!name || !userName || !email || !password) {
    return res.json({
      success: false,
      message: "All fields are required !!",
    });
  }

  if (!validator.isEmail(email))
    return res.json({
      success: false,
      message: "Enter correct email format.",
    });

  const userAlreadyExist = await User.findOne({ email });

  if (userAlreadyExist)
    return res.json({
      success: false,
      message: "Email Already Registered.",
    });

  const usernameAlreadyExist = await User.findOne({ userName });
  if (usernameAlreadyExist)
    return res.json({
      success: false,
      message: "Username taken, try different.",
    });

  if (password.length < 6)
    return res.json({
      success: false,
      message: "Password should be of atleast of 6 chars.",
    });

  const user = await User.create(req.body);

  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res) => {
  const { userName, email, password } = req.body;

  // If field not recived from body.
  if ((!email || !userName) && !password)
    return res.json({
      success: false,
      message: "All fields required",
    });

  const userUniqueValue = email === undefined ? userName : email;
  const user = await User.findOne({ userUniqueValue })
    .select("+password")
    .populate("following")
    .populate("followers")
    .populate("posts")
    .populate("likedPosts")
    .populate("bookmarkedPosts")
    .populate("archivePosts")
    .populate("notification");

  // If user not present in database.
  if (!user)
    return res.json({
      success: false,
      message: "User Doesn't exists in the database.",
    });

  // If password doesn't match.
  if (!(await user.isPasswordValidated(password)))
    return res.json({
      success: false,
      message: "Incorrect Password !!",
    });

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout Success",
  });
});

exports.forgotPassword = BigPromise(async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.json({
      success: false,
      message: "Email field is required",
    });

  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "Invalid Email, not registered",
    });

  const forgotCode = user.getForgotPasswordCode();

  await user.save({ validateBeforeSave: false });

  const message = `<div>Copy and paste this Code <b>${forgotCode}</b> to verify.</div>`;

  try {
    await mailHelper({
      to: email,
      subject: "UnSocial - Password Reset Mail",
      text: message,
      html: message,
    });

    res.status(200).json({
      success: true,
      message: "Mail sent succefully.",
    });
  } catch (error) {
    user.forgotPasswordCode = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return res.json({
      success: false,
      message: "This Email doesn't Exists in gmail.",
      error: error.message,
    });
  }
});

exports.verifyForgotCode = BigPromise(async (req, res) => {
  const { forgotCode } = req.body;

  const encrypToken = crypto
    .createHash("sha256")
    .update(forgotCode)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordCode: encrypToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user)
    res.json({
      success: false,
      message: "Invalid Code or Code Expired.",
    });

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRY * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(200).cookie("userVerify", encrypToken, cookieOptions).json({
    success: true,
    message: "User Verifed",
  });
});

exports.passwordReset = BigPromise(async (req, res) => {
  const user = req.user;

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword)
    return res.json({
      success: false,
      message: "Both fields are required",
    });

  if (password !== confirmPassword)
    res.json({
      success: false,
      message: "Password and Confirm Password didn't match",
    });

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  res.cookie("userVerify", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    // sameSite: "none",
    // secure: true,
  });

  cookieToken(user, res);
});

//User loggedIn Controllers
exports.userDashboard = BigPromise(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = BigPromise(async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordValidated = await user.isPasswordValidated(
    req.body.oldPassword
  );

  if (!isPasswordValidated)
    res.json({
      success: false,
      message: "Enter correct old password.",
    });

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword)
    return res.json({
      success: false,
      message: "Password and ConfirmPassword both fields are required",
    });

  if (password !== confirmPassword)
    res.json({
      success: false,
      message: "Password and Confirm Password didn't match",
    });

  user.password = password;

  await user.save();

  cookieToken(user, res);
});

exports.updateUser = BigPromise(async (req, res) => {
  const user = req.user;

  const updatedObject = {
    name: req.body.name,
    userName: req.body.userName,
    email: req.body.email,
    bio: req.body.bio,
  };

  if (req.body.email) {
    if (!validator.isEmail(req.body.email))
      return res.json({
        success: false,
        message: "Enter correct email format.",
      });
  }

  if (req.body.userName !== user.userName) {
    if (await User.findOne({ userName }))
      return res.json({
        success: false,
        message: "Username taken, try different.",
      });
  }

  if (req.files) {
    const photo = req.files.profilePicture;

    if (user.profilePicture.id !== "")
      await cloudinary.uploader.destroy(user.profilePicture.id);

    const result = await cloudinary.uploader.upload(photo.tempFilePath, {
      folder: "unsocial/profile_picture",
      width: 150,
      crop: "scale",
    });

    updatedObject.profilePicture = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const updatedUser = extend(user, updatedObject);

  await user.save();

  res.status(200).json({
    success: true,
    updatedUser,
  });
});

// Follow & Unfollow Controller
exports.followUser = BigPromise(async (req, res) => {
  const user = req.user;
  const { userId } = req.body;

  if (user.following.find((user) => user._id.toString() === userId))
    return res.json({
      success: false,
    });

  user.following.push(userId);

  await user.save();

  const followedUser = await User.findById(userId);

  followedUser.followers.push(user._id.toString());

  await followedUser.save();

  res.status(200).json({
    success: true,
    user,
  });
});

exports.unfollowUser = BigPromise(async (req, res) => {
  const user = req.user;
  const { userId } = req.body;

  const updatedFollowing = user.following.filter(
    (user) => user._id.toString() !== userId
  );

  await user.updateOne({ following: updatedFollowing });

  const followedUser = await User.findById(userId);

  const updatedFollowers = followedUser.followers.filter(
    (user) => user._id.toString() !== user._id
  );

  await followedUser.updateOne({ followers: updatedFollowers });

  res.status(200).json({
    success: true,
    user,
  });
});

// Bookmarked Posts Controller
exports.addToBookmarkedPosts = BigPromise(async (req, res) => {
  const user = req.user;

  if (
    user.bookmarkedPosts.find((post) => post._id.toString() === req.body.postId)
  )
    return res.json({
      success: false,
    });

  user.bookmarkedPosts.push(req.body.postId);

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteFromBookmarkedPosts = BigPromise(async (req, res) => {
  const user = req.user;

  const updatedBookmarkedPosts = user.bookmarkedPosts.filter(
    (post) => post._id.toString() !== req.body.postId
  );

  await user.updateOne({ bookmarkedPosts: updatedBookmarkedPosts });

  res.status(200).json({
    success: true,
    user,
  });
});

// Archive Posts Controller
exports.addToArchivePosts = BigPromise(async (req, res) => {
  const user = req.user;

  if (user.archivePosts.find((post) => post._id.toString() === req.body.postId))
    return res.json({
      success: false,
    });

  user.archivePosts.push(req.body.postId);

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteFromArchivePosts = BigPromise(async (req, res) => {
  const user = req.user;

  const updatedArchivePosts = user.archivePosts.filter(
    (post) => post._id.toString() !== req.body.postId
  );

  await user.updateOne({ archivePosts: updatedArchivePosts });

  res.status(200).json({
    success: true,
    user,
  });
});

// Notifications Controller
exports.addToNotification = BigPromise(async (req, res) => {
  const user = req.user;

  if (
    user.notification.find(
      (notification) => notification._id.toString() === req.body.notificationId
    )
  )
    return res.json({
      success: false,
    });

  user.notification.push(req.body.notificationId);

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteFromNotification = BigPromise(async (req, res) => {
  const user = req.user;

  const updatedNotification = user.notification.filter(
    (notification) => notification._id.toString() !== req.body.notificationId
  );

  await user.updateOne({ notification: updatedNotification });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.getUser = BigPromise(async (req, res) => {
  const { userName } = req.params;
  const user = await User.find({ userName });
  user.bookmarkedPosts = undefined;
  user.archivePosts = undefined;
  user.notification = undefined;

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin Controllers
exports.adminUsers = BigPromise(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminGetUser = BigPromise(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateUser = BigPromise(async (req, res) => {
  const user = await User.findById(req.params.id);

  const updatedUser = extend(user, req.body);

  await user.save();

  res.status(200).json({
    success: true,
    updatedUser,
  });
});

exports.adminDeleteUser = BigPromise(async (req, res) => {
  const user = await User.findById(req.params.id);

  await user.delete();

  res.status(200).json({
    success: true,
    user,
  });
});
